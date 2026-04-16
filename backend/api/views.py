from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Transaction, BusinessProfile, Stock, UserProfile
# from ai_engine.scoring_agent import analyze_business_health  # Temporarily commented out
import requests
import json
import base64
from django.conf import settings

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
        return Response({'error': 'Username, email, password, and business name are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Split name into first and last name if provided
        name = request.data.get('name', '')
        name_parts = name.split(' ', 1)
        first_name = name_parts[0] if name_parts else ''
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # Create user profile
        UserProfile.objects.create(
            user=user,
            phone_number=phone_number,
            business_name=business_name,
            industry=industry
        )

        # Create business profile
        BusinessProfile.objects.create(
            user=user,
            name=business_name,
            industry=industry,
            owner_phone=phone_number
        )

        # Create token
        token = Token.objects.create(user=user)

        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'business_name': business_name,
                'industry': industry,
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    """Login user and return token"""
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if user:
        token, created = Token.objects.get_or_create(user=user)

        # Get business profile
        try:
            business = BusinessProfile.objects.get(user=user)
            business_data = {
                'id': business.id,
                'name': business.name,
                'industry': business.industry,
                'owner_phone': business.owner_phone,
                'trust_score': business.trust_score,
            }
        except BusinessProfile.DoesNotExist:
            business_data = None

        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'business': business_data
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    """Logout user by deleting token"""
    request.user.auth_token.delete()
    return Response({'message': 'Successfully logged out'})

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
        return Response({
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
                'trust_score': business_profile.trust_score,
            }
        })

    elif request.method == 'PUT':
        # Update user basic info
        if 'first_name' in request.data:
            request.user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            request.user.last_name = request.data['last_name']
        if 'email' in request.data:
            request.user.email = request.data['email']
        request.user.save()

        # Update user profile
        if 'phone_number' in request.data:
            user_profile.phone_number = request.data['phone_number']
        if 'business_name' in request.data:
            user_profile.business_name = request.data['business_name']
            business_profile.name = request.data['business_name']
        if 'industry' in request.data:
            user_profile.industry = request.data['industry']
            business_profile.industry = request.data['industry']
        if 'owner_phone' in request.data:
            business_profile.owner_phone = request.data['owner_phone']

        user_profile.save()
        business_profile.save()

        return Response({
            'message': 'Settings updated successfully',
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
                'trust_score': business_profile.trust_score,
            }
        })

# M-Pesa Daraja API Bridge
class MpesaAPI:
    def __init__(self):
        self.consumer_key = getattr(settings, 'MPESA_CONSUMER_KEY', '')
        self.consumer_secret = getattr(settings, 'MPESA_CONSUMER_SECRET', '')
        self.shortcode = getattr(settings, 'MPESA_SHORTCODE', '')
        self.passkey = getattr(settings, 'MPESA_PASSKEY', '')
        self.base_url = 'https://sandbox.safaricom.co.ke'  # Use production URL for live

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

    def stk_push(self, phone_number, amount, account_reference, transaction_desc):
        """Initiate STK Push"""
        access_token = self.get_access_token()
        if not access_token:
            return {'error': 'Failed to get access token'}

        timestamp = '20260416120000'  # Should be dynamic
        password = base64.b64encode(
            f'{self.shortcode}{self.passkey}{timestamp}'.encode()
        ).decode('utf-8')

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
            return response.json()
        except Exception as e:
            return {'error': str(e)}

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mpesa_stk_push(request):
    """Initiate M-Pesa STK Push for payment"""
    phone_number = request.data.get('phone_number')
    amount = request.data.get('amount')
    account_reference = request.data.get('account_reference', 'KIVULI Payment')
    transaction_desc = request.data.get('transaction_desc', 'Payment for services')

    if not phone_number or not amount:
        return Response({'error': 'Phone number and amount are required'}, status=status.HTTP_400_BAD_REQUEST)

    mpesa_api = MpesaAPI()
    result = mpesa_api.stk_push(phone_number, amount, account_reference, transaction_desc)

    if 'error' in result:
        return Response(result, status=status.HTTP_400_BAD_REQUEST)

    return Response(result)

@api_view(['POST'])
@permission_classes([AllowAny])
def mpesa_callback(request):
    """Handle M-Pesa callback"""
    # This endpoint should be called by M-Pesa after transaction completion
    callback_data = request.data

    # Process the callback data here
    # You would typically save transaction details to database

    return Response({'message': 'Callback received'})

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
        
        # Temporarily return mock AI response
        ai_response = "Mock AI analysis: Your business shows good transaction patterns. Consider diversifying income streams and maintaining consistent cash flow."
        
        return Response({
            "business_name": business.name,
            "ai_insight": ai_response
        })
    except BusinessProfile.DoesNotExist:
        return Response({"error": "Business profile not found"}, status=404)

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
        return Response(data)
    
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
            
            return Response({
                'id': stock.id,
                'item_name': stock.item_name,
                'quantity': stock.quantity,
                'status': stock.status,
                'message': 'Stock item added successfully'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_stock(request, stock_id):
    """Update or delete a stock item"""
    try:
        stock = Stock.objects.get(id=stock_id, user=request.user)
    except Stock.DoesNotExist:
        return Response({"error": "Stock item not found"}, status=404)
    
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
        
        return Response({
            'id': stock.id,
            'item_name': stock.item_name,
            'quantity': stock.quantity,
            'status': stock.status,
            'message': 'Stock item updated successfully'
        })
    
    elif request.method == 'DELETE':
        stock.delete()
        return Response({'message': 'Stock item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sell_stock(request, stock_id):
    """Mark stock as sold or reduce quantity"""
    try:
        stock = Stock.objects.get(id=stock_id, user=request.user)
    except Stock.DoesNotExist:
        return Response({"error": "Stock item not found"}, status=404)
    
    quantity_sold = int(request.data.get('quantity_sold', 1))
    
    if quantity_sold > stock.quantity:
        return Response({"error": "Cannot sell more than available quantity"}, status=status.HTTP_400_BAD_REQUEST)
    
    stock.quantity -= quantity_sold
    
    # Update status
    if stock.quantity == 0:
        stock.status = 'sold'
    elif stock.quantity < stock.minimum_quantity:
        stock.status = 'low_stock'
    else:
        stock.status = 'in_stock'
    
    stock.save()
    
    return Response({
        'id': stock.id,
        'item_name': stock.item_name,
        'quantity_remaining': stock.quantity,
        'quantity_sold': quantity_sold,
        'status': stock.status,
        'message': f'{quantity_sold} units of {stock.item_name} marked as sold'
    })