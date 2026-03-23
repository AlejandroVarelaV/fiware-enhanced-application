"""
Health check endpoints for backend and Orion connectivity verification.
"""

from flask import Blueprint, jsonify, current_app
from datetime import datetime
from app.models.exceptions import OrionConnectionError

health_bp = Blueprint('health', __name__, url_prefix='/api')


@health_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint that verifies backend and Orion connectivity.
    
    Returns:
        JSON response with backend status and Orion connection status.
        Returns 200 if both are healthy, 503 if Orion is unreachable.
    """
    status = {
        'status': 'ok',
        'timestamp': datetime.utcnow().isoformat() + 'Z',
    }
    include_debug_info = current_app.config.get('DEBUG', False)
    
    # Check Orion connectivity
    try:
        orion_service = current_app.orion_service
        is_connected = orion_service.check_connection()
        
        if is_connected:
            status['orion'] = 'connected'
            # Include URL for debugging in non-production environments
            if include_debug_info:
                status['orion_url'] = orion_service.base_url
            return jsonify(status), 200
        else:
            status['orion'] = 'disconnected'
            status['message'] = 'Orion Context Broker is not responding'
            # Include URL for debugging in non-production environments
            if include_debug_info:
                status['orion_url'] = orion_service.base_url
            return jsonify(status), 503

    except OrionConnectionError as e:
        status['orion'] = 'disconnected'
        status['message'] = f'Failed to connect to Orion: {str(e)}'
        return jsonify(status), 503

    except Exception as e:
        current_app.logger.exception('Unexpected error in health_check')
        return jsonify({
            'status': 'error',
            'orion': 'unknown',
            'message': 'Internal server error',
            'timestamp': datetime.utcnow().isoformat() + 'Z',
        }), 500
