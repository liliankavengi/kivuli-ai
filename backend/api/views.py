from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Transaction, BusinessProfile
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