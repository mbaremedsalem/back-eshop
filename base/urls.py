from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRooutes,name="routes"),
    path('products/create/', views.createProduct, name="product-create"),
    path('products/upload/', views.uploadImage, name="image-upload"),

    path('products/', views.getProducts,name="products"),
    path('products/<str:pk>', views.getProduct,name="product"),
    path('products/top/', views.getTopProducts, name='top-products'),
    path('products/<str:pk>/reviews/', views.createProductReview, name="create-review"),

    path('products/update/<str:pk>/', views.updateProduct, name="product-update"),
    path('products/delete/<str:pk>/', views.deleteProduct, name="product-delete"),
    #####------ user --------#######
    path('login/', views.MyTokenObtainPairView.as_view(),name='token_obtain_pair'),

    path('register/', views.registerUser, name='register'),

    path('profile/', views.getUserProfile, name="users-profile"),
    path('profile/update/', views.updateUserProfile, name="user-profile-update"),
    path('', views.getUsers, name="users"),

    path('<str:pk>/', views.getUserById, name='user'),

    path('update/<str:pk>/', views.updateUser, name='user-update'),

    path('delete/<str:pk>/', views.deleteUser, name='user-delete'),

    #####------ order --------#######
    path('orders', views.getOrders, name='orders'),
    path('orders/add/', views.addOrderItems, name='orders-add'),
    path('orders/myorders/', views.getMyOrders, name='myorders'),

    path('orders/<str:pk>/deliver/', views.updateOrderToDelivered, name='order-delivered'),

    path('orders/<str:pk>/', views.getOrderById, name='user-order'),
    path('orders/<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
]
