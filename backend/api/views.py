from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Transaction, BusinessProfile, Stock
from ai_engine.scoring_agent import analyze_business_health

@api_view(['GET'])
def get_ai_score(request, business_id):
    try:
        # 1. Get the business and its transactions
        business = BusinessProfile.objects.get(id=business_id)
        txs = Transaction.objects.filter(business=business)
        
        # 2. Create a summary for the AI
        summary = f"Business: {business.name}. "
        summary += ", ".join([f"{t.transaction_type}: {t.amount}" for t in txs])
        
        # 3. Get the AI insight (Calling the Gemini script we tested!)
        ai_response = analyze_business_health(summary)
        
        return Response({
            "business_name": business.name,
            "ai_insight": ai_response
        })
    except BusinessProfile.DoesNotExist:
        return Response({"error": "Business not found"}, status=404)

# Stock Management Endpoints
@api_view(['GET', 'POST'])
def manage_stock(request, business_id):
    """Get all stock items or create a new stock item"""
    try:
        business = BusinessProfile.objects.get(id=business_id)
    except BusinessProfile.DoesNotExist:
        return Response({"error": "Business not found"}, status=404)
    
    if request.method == 'GET':
        stocks = Stock.objects.filter(business=business)
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
                business=business,
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
def update_stock(request, business_id, stock_id):
    """Update or delete a stock item"""
    try:
        business = BusinessProfile.objects.get(id=business_id)
        stock = Stock.objects.get(id=stock_id, business=business)
    except BusinessProfile.DoesNotExist:
        return Response({"error": "Business not found"}, status=404)
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
def sell_stock(request, business_id, stock_id):
    """Mark stock as sold or reduce quantity"""
    try:
        business = BusinessProfile.objects.get(id=business_id)
        stock = Stock.objects.get(id=stock_id, business=business)
    except BusinessProfile.DoesNotExist:
        return Response({"error": "Business not found"}, status=404)
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