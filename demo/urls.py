from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("", include("app.urls")),
    path("admin/", admin.site.urls),
    path("app/", include("app.urls")),
]
