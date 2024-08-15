from django.contrib import admin
from .models import *
from import_export import resources
from import_export.admin import ImportExportModelAdmin

# In a file like admin.py or resources.py within your app
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget


class ProductResource(resources.ModelResource):
    class Meta:
        model = Product
        import_id_fields = ['_id']
        fields = ('_id', 'name', 'image', 'description', 'brand', 'category', 'price', 'countInStock', 'rating', 'numReviews')
        skip_unchanged = True
        report_skipped = False



class ProductAdmin(ImportExportModelAdmin):
    resource_class = ProductResource
    list_display = ['name', 'brand', 'category','price','countInStock','createdAt','rating','numReviews']


class ReviewAdmin(admin.ModelAdmin):
    list_editable = ['rating']
    list_display = ['product', 'user', 'name','rating','comment','createdAt']

class OrderAdmin(admin.ModelAdmin):
    list_editable = ['isPaid','isDelivered']
    list_display = ['user','paymentMethod', 'taxPrice','shippingPrice','totalPrice','isPaid','isDelivered','deliveredAt','createdAt']

class OrderItemAdmin(admin.ModelAdmin):
    list_editable = ['name','qty']
    list_display = ['product','order', 'name','qty','price','image']

class ShippingAddressAdmin(admin.ModelAdmin):
    list_editable = ['city']
    list_display = ['address','order', 'city','postalCode','country','shippingPrice']

admin.site.register(Product, ProductAdmin)
admin.site.register(Review,ReviewAdmin)
admin.site.register(Order,OrderAdmin)
admin.site.register(OrderItem,OrderItemAdmin)
admin.site.register(ShippingAddress,ShippingAddressAdmin)