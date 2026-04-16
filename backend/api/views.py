from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Transaction, BusinessProfile, Stock, UserProfile, MpesaCheckout
# from ai_engine.scoring_agent import analyze_business_health  # Temporarily commented out
import requests
import json
import base64
from datetime import datetime
from django.conf import settings
from .utils.responses import success_response, error_response

# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def user_register(request):
    """Register new user and create business profile"""
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    business_name = request.data.get('business_name')
    industry = request.data.get('industry', '')
    phone_number = request.data.get('phone_number', '')

    if not username or not email or not password or not business_name:
        return error_response('Username, email, password, and business name are required')

    if User.objects.filter(username=username).exists():
        return error_response('Username already exists')

    if User.objects.filter(email=email).exists():
        return error_response('Email already exists')

    try:
        # Split name into first and last name
        name = request.data.get('name', '')
        name_parts = name.split(' ', 1)
        first_name = name_parts[0] if name_parts else ''
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        UserProfile.objects.create(
            user=user,
            phone_number=phone_number,
            business_name=business_name,
            industry=industry,
            role=request.data.get('role', 'owner')
        )

        BusinessProfile.objects.create(
            user=user,
            name=business_name,
            industry=industry,
            owner_phone=phone_number,
            registration_number=request.data.get('registration_number', ''),
            tax_pin=request.data.get('tax_pin', '')
        )

        token = Token.objects.create(user=user)

        # Log verification Link (Mock email sending)
        print(f"DEBUG: Verification link for {email}: http://localhost:5173/verify-email?token={token.key}")

        return success_response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'business_name': business_name,
                'role': user.userprofile.role
            }
        }, "User registered successfully", status.HTTP_201_CREATED)

    except Exception as e:
        return error_response(str(e))

@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    """Login user and return token"""
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return error_response('Username and password are required')

    user = authenticate(username=username, password=password)
    if user:
        token, created = Token.objects.get_or_create(user=user)

        # Get profiles
        try:
            profile = UserProfile.objects.get(user=user)
            business = BusinessProfile.objects.get(user=user)
            business_data = {
                'id': business.id,
                'name': business.name,
                'industry': business.industry,
                'owner_phone': business.owner_phone,
                'trust_score': business.trust_score,
                'is_verified': profile.is_email_verified
            }
        except (BusinessProfile.DoesNotExist, UserProfile.DoesNotExist):
            business_data = None

        return success_response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': profile.role if business_data else 'owner'
            },
            'business': business_data
        }, "Login successful")
    return error_response('Invalid credentials', status_code=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    """Logout user by deleting token"""
    request.user.auth_token.delete()
    return success_response(message="Successfully logged out")

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request):
    """Verify user email using token"""
    token_key = request.data.get('token')
    try:
        token = Token.objects.get(key=token_key)
        profile = UserProfile.objects.get(user=token.user)
        profile.is_email_verified = True
        profile.save()
        return success_response(message="Email verified successfully")
    except (Token.DoesNotExist, UserProfile.DoesNotExist):
        return error_response("Invalid or expired token", status_code=status.HTTP_400_BAD_REQUEST)

# Settings Views
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_settings(request):
    """Get or update user settings"""
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        business_profile = BusinessProfile.objects.get(user=request.user)
    except (UserProfile.DoesNotExist, BusinessProfile.DoesNotExist):
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return success_response({
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'role': user_profile.role
            },
            'profile': {
                'phone_number': user_profile.phone_number,
                'business_name': user_profile.business_name,
                'industry': user_profile.industry,
                'is_verified': user_profile.is_email_verified
            },
            'business': {
                'name': business_profile.name,
                'industry': business_profile.industry,
                'owner_phone': business_profile.owner_phone,
                'trust_score': business_profile.trust_score,
                'registration_number': business_profile.registration_number,
                'tax_pin': business_profile.tax_pin,
                'physical_address': business_profile.physical_address,
                'website': business_profile.website
            }
        })

    elif request.method == 'PUT':
        data = request.data
        # Update user basic info
        if 'first_name' in data:
            request.user.first_name = data['first_name']
        if 'last_name' in data:
            request.user.last_name = data['last_name']
        if 'email' in data:
            request.user.email = data['email']
        request.user.save()

        # Update user profile
        if 'phone_number' in data:
            user_profile.phone_number = data['phone_number']
            business_profile.owner_phone = data['phone_number']
        if 'business_name' in data:
            user_profile.business_name = data['business_name']
            business_profile.name = data['business_name']
        if 'industry' in data:
            user_profile.industry = data['industry']
            business_profile.industry = data['industry']
        
        # Update expanded business profile fields
        if 'registration_number' in data:
            business_profile.registration_number = data['registration_number']
        if 'tax_pin' in data:
            business_profile.tax_pin = data['tax_pin']
        if 'physical_address' in data:
            business_profile.physical_address = data['physical_address']
        if 'website' in data:
            business_profile.website = data['website']

        user_profile.save()
        business_profile.save()

        return success_response({
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
            },
            'profile': {
                'phone_number': user_profile.phone_number,
                'business_name': user_profile.business_name,
                'industry': user_profile.industry,
            },
            'business': {
                'name': business_profile.name,
                'industry': business_profile.industry,
                'owner_phone': business_profile.owner_phone,
                'registration_number': business_profile.registration_number,
                'tax_pin': business_profile.tax_pin,
            }
        }, "Settings updated successfully")

# M-Pesa Daraja API Bridge
class MpesaAPI:
    def __init__(self):
        self.consumer_key = getattr(settings, 'MPESA_CONSUMER_KEY', '')
        self.consumer_secret = getattr(settings, 'MPESA_CONSUMER_SECRET', '')
        self.shortcode = getattr(settings, 'MPESA_SHORTCODE', '174379')
        self.passkey = getattr(settings, 'MPESA_PASSKEY', '')
        self.base_url = 'https://sandbox.safaricom.co.ke'  # Use production URL for live

    def get_timestamp(self):
        """Generate dynamic timestamp in YYYYMMDDHHMMSS format"""
        return datetime.now().strftime('%Y%m%d%H%M%S')

    def get_password(self, timestamp):
        """Generate base64 encoded password"""
        str_to_encode = f"{self.shortcode}{self.passkey}{timestamp}"
        return base64.b64encode(str_to_encode.encode()).decode('utf-8')

    def get_access_token(self):
        """Get M-Pesa access token"""
        try:
            response = requests.get(
                f'{self.base_url}/oauth/v1/generate?grant_type=client_credentials',
                auth=(self.consumer_key, self.consumer_secret)
            )
            if response.status_code == 200:
                return response.json()['access_token']
            return None
        except Exception as e:
            print(f"Error getting access token: {e}")
            return None

    def stk_push(self, phone_number, amount, account_reference, transaction_desc, user):
        """Initiate STK Push and track the checkout"""
        access_token = self.get_access_token()
        if not access_token:
            return {'error': 'Failed to get access token'}

        timestamp = self.get_timestamp()
        password = self.get_password(timestamp)

        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone_number,
            "PartyB": self.shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": getattr(settings, 'MPESA_CALLBACK_URL', ''),
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc
        }

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

        try:
            response = requests.post(
                f'{self.base_url}/mpesa/stkpush/v1/processrequest',
                json=payload,
                headers=headers
            )
            data = response.json()
            
            if data.get('ResponseCode') == '0':
                # Track the checkout
                MpesaCheckout.objects.create(
                    user=user,
                    checkout_request_id=data.get('CheckoutRequestID'),
                    amount=amount,
                    phone_number=phone_number
                )
            return data
        except Exception as e:
            return {'error': str(e)}

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mpesa_stk_push(request):
    """Initiate M-Pesa STK Push for payment"""
    phone_number = request.data.get('phone_number')
    amount = request.data.get('amount')
    account_reference = request.data.get('account_reference', 'KIVULI Payment')
    transaction_desc = request.data.get('transaction_desc', 'Kivuli AI Service Payment')

    if not phone_number or not amount:
        return error_response('Phone number and amount are required')

    mpesa_api = MpesaAPI()
    result = mpesa_api.stk_push(phone_number, amount, account_reference, transaction_desc, request.user)

    if 'error' in result:
        return error_response(result['error'])

    return success_response(result, "STK Push initiated successfully")

@api_view(['POST'])
@permission_classes([AllowAny])
def mpesa_callback(request):
    """Handle M-Pesa callback from Safaricom"""
    try:
        data = request.data.get('Body', {}).get('stkCallback', {})
        res_code = data.get('ResultCode')
        checkout_id = data.get('CheckoutRequestID')

        if res_code == 0:
            # Success
            meta = data.get('CallbackMetadata', {}).get('Item', [])
            receipt = next((x['Value'] for x in meta if x['Name'] == 'MpesaReceiptNumber'), None)
            amount = next((x['Value'] for x in meta if x['Name'] == 'Amount'), 0)
            phone = next((x['Value'] for x in meta if x['Name'] == 'PhoneNumber'), None)

            # Find checkout and mark as completed
            try:
                checkout = MpesaCheckout.objects.get(checkout_request_id=checkout_id)
                checkout.is_completed = True
                checkout.save()

                # Save transaction
                Transaction.objects.get_or_create(
                    user=checkout.user,
                    mpesa_receipt_number=receipt,
                    defaults={
                        'amount': amount,
                        'transaction_type': 'Sale',
                        'ai_category': 'Direct Payment'
                    }
                )
                print(f"SUCCESS: Payment received from {phone} for {amount}. Receipt: {receipt}")
            except MpesaCheckout.DoesNotExist:
                print(f"ERROR: Checkout {checkout_id} not found in database.")

        return success_response(message="Callback processed")
    except Exception as e:
        print(f"ERROR: Failed to process M-Pesa callback: {str(e)}")
        return success_response(message="Callback received but failed to process")

@api_view(['POST'])
@permission_classes([AllowAny])
def user_password_reset(request):
    """Mock password reset endpoint"""
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # In real app, send email with token here
    return Response({'message': f'Password reset link sent to {email}'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_ai_score(request):
    try:
        # Get the user's business and its transactions
        business = BusinessProfile.objects.get(user=request.user)
        txs = Transaction.objects.filter(user=request.user)
        
        # Create a summary for the AI
        summary = f"Business: {business.name}. "
        summary += ", ".join([f"{t.transaction_type}: {t.amount}" for t in txs])
        
        # Total income and expenses calculation
        total_income = sum([float(t.amount) for t in txs if t.amount > 0 and t.transaction_type in ['Sale', 'Income']])
        total_income = total_income if total_income > 0 else 296000 # Mock fallback if empty for demo
        total_expenses = sum([float(t.amount) for t in txs if t.transaction_type == 'Expense'])
        total_expenses = total_expenses if total_expenses > 0 else 200000 # Mock fallback if empty
        net_balance = total_income - total_expenses
        transaction_count = txs.count() if txs.count() > 0 else 148 # Mock fallback if empty
        
        # Temporarily return mock AI response
        ai_response = "Mock AI analysis: Your business shows good transaction patterns. Consider diversifying income streams and maintaining consistent cash flow."
        
        return success_response({
            "business_name": business.name,
            "ai_insight": ai_response,
            "score": 85,
            "strengths": ["Consistent daily M-Pesa activity", "Positive net cash flow for 4+ months"],
            "risks": ["Income sources not diversified"],
            "sdg_8_advice": "Your business demonstrates strong alignment with UN SDG 8. Consider formalizing payroll for workers.",
            "totalIncome": total_income,
            "totalExpenses": total_expenses,
            "netBalance": net_balance,
            "transactionCount": transaction_count
        })
    except BusinessProfile.DoesNotExist:
        return error_response("Business profile not found", status_code=status.HTTP_404_NOT_FOUND)

# Stock Management Endpoints
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def manage_stock(request):
    """Get all stock items or create a new stock item"""
    if request.method == 'GET':
        stocks = Stock.objects.filter(user=request.user)
        data = []
        for stock in stocks:
            data.append({
                'id': stock.id,
                'item_name': stock.item_name,
                'category': stock.category,
                'quantity': stock.quantity,
                'unit_price': float(stock.unit_price),
                'selling_price': float(stock.selling_price),
                'minimum_quantity': stock.minimum_quantity,
                'status': stock.status,
                'total_value': float(stock.quantity * stock.unit_price),
                'date_added': stock.date_added,
                'notes': stock.notes,
            })
        return success_response(data)
    
    elif request.method == 'POST':
        data = request.data
        try:
            stock = Stock.objects.create(
                user=request.user,
                item_name=data.get('item_name'),
                category=data.get('category', ''),
                quantity=int(data.get('quantity', 0)),
                unit_price=float(data.get('unit_price', 0)),
                selling_price=float(data.get('selling_price', 0)),
                minimum_quantity=int(data.get('minimum_quantity', 5)),
                notes=data.get('notes', '')
            )
            
            # Update status based on quantity
            if stock.quantity == 0:
                stock.status = 'out_of_stock'
            elif stock.quantity < stock.minimum_quantity:
                stock.status = 'low_stock'
            else:
                stock.status = 'in_stock'
            stock.save()
            
            return success_response({
                'id': stock.id,
                'item_name': stock.item_name,
                'quantity': stock.quantity,
                'status': stock.status,
            }, "Stock item added successfully", status.HTTP_201_CREATED)
        except Exception as e:
            return error_response(str(e))

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_stock(request, stock_id):
    """Update or delete a stock item"""
    try:
        stock = Stock.objects.get(id=stock_id, user=request.user)
    except Stock.DoesNotExist:
        return error_response("Stock item not found", status_code=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        data = request.data
        
        # Update fields
        if 'item_name' in data:
            stock.item_name = data['item_name']
        if 'category' in data:
            stock.category = data['category']
        if 'quantity' in data:
            stock.quantity = int(data['quantity'])
        if 'unit_price' in data:
            stock.unit_price = float(data['unit_price'])
        if 'selling_price' in data:
            stock.selling_price = float(data['selling_price'])
        if 'minimum_quantity' in data:
            stock.minimum_quantity = int(data['minimum_quantity'])
        if 'notes' in data:
            stock.notes = data['notes']
        
        # Update status based on quantity
        if stock.quantity == 0:
            stock.status = 'out_of_stock'
        elif stock.quantity < stock.minimum_quantity:
            stock.status = 'low_stock'
        else:
            stock.status = 'in_stock'
        
        stock.save()
        
        return success_response({
            'id': stock.id,
            'item_name': stock.item_name,
            'quantity': stock.quantity,
            'status': stock.status,
        }, "Stock item updated successfully")
    
    elif request.method == 'DELETE':
        stock.delete()
        return success_response(message="Stock item deleted successfully", status_code=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sell_stock(request, stock_id):
    """Mark stock as sold or reduce quantity"""
    try:
        stock = Stock.objects.get(id=stock_id, user=request.user)
    except Stock.DoesNotExist:
        return error_response("Stock item not found", status_code=status.HTTP_404_NOT_FOUND)
    
    quantity_sold = int(request.data.get('quantity_sold', 1))
    
    if quantity_sold > stock.quantity:
        return error_response("Cannot sell more than available quantity")
    
    stock.quantity -= quantity_sold
    
    # Update status
    if stock.quantity == 0:
        stock.status = 'sold'
    elif stock.quantity < stock.minimum_quantity:
        stock.status = 'low_stock'
    else:
        stock.status = 'in_stock'
    
    stock.save()
    
    return success_response({
        'id': stock.id,
        'item_name': stock.item_name,
        'quantity_remaining': stock.quantity,
        'quantity_sold': quantity_sold,
        'status': stock.status,
    }, f'{quantity_sold} units of {stock.item_name} marked as sold')