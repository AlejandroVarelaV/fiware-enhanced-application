"""Product API routes."""

from flask import Blueprint, current_app, jsonify, request


product_bp = Blueprint('products', __name__, url_prefix='/api/products')


@product_bp.route('', methods=['POST'])
def create_product():
    payload = request.get_json(silent=True)
    product = current_app.product_service.create(payload)
    return jsonify(product), 201


@product_bp.route('', methods=['GET'])
def list_products():
    products = current_app.product_service.list()
    return jsonify(products), 200


@product_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    product = current_app.product_service.get(product_id)
    return jsonify(product), 200


@product_bp.route('/<product_id>', methods=['PATCH'])
def update_product(product_id):
    payload = request.get_json(silent=True)
    product = current_app.product_service.update(product_id, payload)
    return jsonify(product), 200


@product_bp.route('/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    current_app.product_service.delete(product_id)
    return '', 204
