"""InventoryItem API routes."""

from flask import Blueprint, current_app, jsonify, request


inventory_item_bp = Blueprint('inventory_items', __name__, url_prefix='/api/inventory-items')


@inventory_item_bp.route('', methods=['POST'])
def create_inventory_item():
    payload = request.get_json(silent=True)
    inventory_item = current_app.inventory_item_service.create(payload)
    return jsonify(inventory_item), 201


@inventory_item_bp.route('', methods=['GET'])
def list_inventory_items():
    inventory_items = current_app.inventory_item_service.list()
    return jsonify(inventory_items), 200


@inventory_item_bp.route('/<inventory_item_id>', methods=['GET'])
def get_inventory_item(inventory_item_id):
    inventory_item = current_app.inventory_item_service.get(inventory_item_id)
    return jsonify(inventory_item), 200


@inventory_item_bp.route('/<inventory_item_id>', methods=['PATCH'])
def update_inventory_item(inventory_item_id):
    payload = request.get_json(silent=True)
    inventory_item = current_app.inventory_item_service.update(inventory_item_id, payload)
    return jsonify(inventory_item), 200


@inventory_item_bp.route('/<inventory_item_id>', methods=['DELETE'])
def delete_inventory_item(inventory_item_id):
    current_app.inventory_item_service.delete(inventory_item_id)
    return '', 204


@inventory_item_bp.route('/<inventory_item_id>/buy', methods=['PATCH'])
def buy_inventory_item(inventory_item_id):
    # Keep the payload exactly as Orion expects for an atomic decrement.
    payload = {
        'shelfCount': {'type': 'Integer', 'value': {'$inc': -1}},
        'stockCount': {'type': 'Integer', 'value': {'$inc': -1}},
    }

    try:
        updated_entity = current_app.orion_service.update_entity_attrs(inventory_item_id, payload)
        return jsonify(updated_entity), 200
    except Exception as exc:
        current_app.logger.exception('Failed to buy inventory item %s', inventory_item_id)
        return jsonify({
            'error': 'BUY_OPERATION_FAILED',
            'message': str(exc),
        }), 500
