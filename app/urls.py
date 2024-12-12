from django.urls import path
from .views import *

app_name = "app"
urlpatterns = [
    path("", index, name="index"),
    path("datatype", select_data_type, name="datatype"),
    path(
        "datatype/<data_type>/",
        select_action_per_datatype,
        name="select_action_per_datatype",
    ),
    path(
        "custom/metric",
        check_custom_data_metric,
        name="check_custom_data_metric",
    ),
    path("metric/<data_type>/<data_name>/", load_metric, name="load_metric"),
    path(
        "metric/<data_type>/<data_name>/metric/",
        get_data_metric,
        name="get_data_metric",
    ),
    path(
        "algorithm/<data_type>/<data_name>/", select_algorithm, name="select_algorithm"
    ),
    path(
        "mitigation/<data_name>/<algorithm_name>/",
        load_mitigation,
        name="load_mitigation_result",
    ),
    path(
        "mitigation/<data_name>/<algorithm_name>/mitigation/",
        get_mitigation_result,
        name="get_mitigation_result",
    ),
    path(
        "text/mitigation/<algorithm_name>/getdata/", get_textdata, name="get_textdata"
    ),
    path(
        "text/mitigation/<algorithm_name>/loading/",
        processing_text_algorithms,
        name="processing_text_algorithms",
    ),
    path(
        "text/mitigation/<algorithm_name>/loading/getresult/",
        show_text_algorithm_result,
        name="show_text_algorithm_result",
    ),
]
