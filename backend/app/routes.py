from flask import Blueprint
from flask_restful import Api
from app.controllers.api_endpoints import (
    LostItemReport,
    FoundItemReport,
    LostItemDetail,
    ItemList,
    TestAPI,
    AllUsers,
)
from app.controllers.auth import (
    Register,
    Login,
    Profile,
    ResetPassword,
    ResetPasswordConfirm,
)


auth_bp = Blueprint("auth", __name__)
auth_api = Api(auth_bp)

auth_api.add_resource(Register, "/register")
auth_api.add_resource(Login, "/login")
auth_api.add_resource(Profile, "/profile")
auth_api.add_resource(AllUsers, "/users")
auth_api.add_resource(ResetPassword, "/reset-password")
auth_api.add_resource(ResetPasswordConfirm, "/reset-password/confirm")

items_bp = Blueprint("items", __name__)
items_api = Api(items_bp)

items_api.add_resource(LostItemReport, "/lost")
items_api.add_resource(LostItemDetail, "/lost/<int:item_id>")
items_api.add_resource(FoundItemReport, "/found")
items_api.add_resource(ItemList, "/items")

test_bp = Blueprint("test", __name__)
test_api = Api(test_bp)

test_api.add_resource(TestAPI, "/test")
