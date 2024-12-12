from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

import os
from .util import *
from .context_processors import ALGORITHM_ID2NAME, ALGORITHM_NAME2ID

import MAF.algorithms.preprocessing as preprocessing
import MAF.algorithms.inprocessing as inprocessing
import MAF.algorithms.postprocessing as postprocessing

from MAF.benchmark.crehate.crehate_demo import check_hatespeech
from MAF.benchmark.kobbq.kobbq_demo import check_korean_bias, KoBBQArguments

from MAF.metric.latte.check_toxicity import check_toxicity


def index(request):
    return render(request, "index.html")


def select_data_type(request):
    return render(request, "selection_menu/select_data_type.html")


@csrf_exempt
def check_custom_data_metric(request):
    if request.method == "POST" and "file" in request.FILES:
        uploaded_file = request.FILES["file"]
        save_dir = os.environ["PYTHONPATH"] + "/MAF/data/custom_data"
        os.makedirs(save_dir, exist_ok=True)

        file_path = save_dir + "/custom.csv"
        with open(file_path, "wb+") as f:
            for chunk in uploaded_file.chunks():
                f.write(chunk)

        data_metric = get_custom_tabular_data_metric(file_path)
        return render(
            request,
            "custom_data_metric.html",
            {"data_name": "custom data", "data": data_metric},
        )


@csrf_exempt
def select_action_per_datatype(request, data_type):
    if data_type == "tabular":
        return render(request, "selection_menu/select_tabular_data.html")
    if data_type == "image":
        return render(request, "selection_menu/select_image_data.html")
    if data_type == "text":
        return render(request, "selection_menu/select_text_algorithm.html")
    if data_type == "audio":
        return render(request, "selection_menu/select_audio_algorithm.html")


@csrf_exempt
def load_metric(request, data_type, data_name):
    return render(
        request,
        "metrics_loading.html",
        {"data_type": data_type, "data_name": data_name},
    )


@csrf_exempt
def get_data_metric(request, data_type, data_name):
    if data_type == "tabular":
        return render(request, "metrics.html", get_tabular_data_metric(data_name))
    if data_type == "image":
        return render(request, "metrics.html", get_image_data_metric(data_name))


@csrf_exempt
def select_algorithm(request, data_type, data_name):
    """
    select algorithm for tabular&image
    """
    if data_type == "tabular":
        return render(
            request,
            "selection_menu/select_tabular_algorithm.html",
            {"data_name": data_name, "data_type": data_type},
        )
    if data_type == "image":
        return render(
            request,
            "selection_menu/select_image_algorithm.html",
            {"data_name": data_name, "data_type": data_type},
        )


@csrf_exempt
def load_mitigation(request, data_name, algorithm_name):
    return render(
        request, "mitigation_loading.html", {"algorithm_name": algorithm_name}
    )


@csrf_exempt
def get_mitigation_result(request, data_name: str, algorithm_name: str):
    if algorithm_name == "intapt":
        result = load_audio_algorithm(algorithm_name)
        return render(
            request,
            f"algorithm/{algorithm_name}.html",
            {
                "algorithm_name": ALGORITHM_ID2NAME[algorithm_name],
                "test_avg_perf": result["test_avg_perf"],
                "perf_diff": result["perf_diff"],
            },
        )

    original_metrics_result, miti_result = load_algorithm(
        data_name, algorithm_name
    ).run()

    html_path = "compare_metric.html"
    if algorithm_name in ["slide", "ftm"]:
        html_path = "algorithm/compare_metric_acc_dp.html"
    if algorithm_name in ["fdf"]:
        html_path = "algorithm/compare_metric_acc.html"
    return render(
        request,
        html_path,
        {
            "data_name": data_name,
            "algorithm_name": ALGORITHM_ID2NAME[algorithm_name],
            "protected_attribute": "sex",
            "original": original_metrics_result,
            "mitigated": miti_result,
        },
    )


@csrf_exempt
def get_textdata(request, algorithm_name: str):
    """
    algorithm_name = ["rh", "latte", "crehate", "kobbq"]
    """
    html_path = f"algorithm/get_data_{algorithm_name}.html"
    result_url = f"/app/text/mitigation/{algorithm_name}/loading/"
    return render(
        request, html_path, {"algorithm": algorithm_name, "result_url": result_url}
    )


@csrf_exempt
def processing_text_algorithms(request, algorithm_name: str):
    redirect_path = f"text/mitigation/{algorithm_name}/getresult/"
    if algorithm_name == "concse":
        return render(request, "text_mitigation_loading.html")

    if algorithm_name == "rh":
        if request.method == "POST":
            request.session["question"] = request.POST.get("question")
            request.session["prompt_no"] = request.POST.get("prompt_no")
            return render(request, "text_mitigation_loading.html")

    if algorithm_name == "latte":
        if request.method == "POST":
            request.session["sentence"] = request.POST.get("sentence")
            return render(request, "text_mitigation_loading.html")

    if algorithm_name == "crehate":
        if request.method == "POST":
            request.session["context"] = request.POST.get("context")
            request.session["simple"] = request.POST.get("simple")
            request.session["persona"] = request.POST.get("persona")
            return render(request, "text_mitigation_loading.html")

    if algorithm_name == "kobbq":
        if request.method == "POST":
            request.session["prompt_id"] = int(request.POST.get("prompt_id"))
            request.session["model"] = request.POST.get("model")
            request.session["context"] = request.POST.get("context")
            request.session["question"] = request.POST.get("question")
            request.session["choices"] = request.POST.get("choices").split(", ")
            request.session["biased_answer"] = request.POST.get("biased_answer")
            request.session["answer"] = request.POST.get("answer")
            return render(request, "text_mitigation_loading.html")


@csrf_exempt
def show_text_algorithm_result(request, algorithm_name: str):
    html_path = f"algorithm/{algorithm_name}.html"
    if algorithm_name == "concse":
        result = inprocessing.concse.mitigate_concse(base_model="mbert_uncased")
        return render(
            request,
            html_path,
            {"algorithm_name": algorithm_name, "spearman_corr": result},
        )

    if algorithm_name == "rh":
        question = request.session.get("question")
        prompt_no = request.session.get("prompt_no")
        rhm = preprocessing.RepresentativenessHeuristicMitigator()
        result = rhm.run(question, prompt_no)
        if result:
            return render(
                request,
                html_path,
                {
                    "algorithm_name": "Representativeness_Heuristic",
                    "question": question,
                    "prompt_for_mitigation": result["prompt_fair"],
                    "baseline_output": result["baseline"],
                    "mitigation_output": result["mitigation_output"],
                },
            )

    if algorithm_name == "latte":
        sentence = request.session.get("sentence")
        result = check_toxicity(sentence)
        return render(
            request,
            html_path,
            {"sentence": result["sentence"], "toxicity": result["toxicity"]},
        )

    if algorithm_name == "crehate":
        context = request.session.get("context")
        simple = request.session.get("simple")
        persona = request.session.get("persona")
        result = check_hatespeech(
            context=context, simple=(simple == "True"), persona=(persona == "True")
        )
        return render(
            request,
            html_path,
            {
                "context": context,
                "simple": simple,
                "persona": persona,
                "result": result,
            },
        )

    if algorithm_name == "kobbq":
        prompt_id = request.session.get("prompt_id")
        model = request.session.get("model")
        context = request.session.get("context")
        question = request.session.get("question")
        choices = request.session.get("choices")
        biased_answer = request.session.get("biased_answer")
        answer = request.session.get("answer")
        args = KoBBQArguments(
            prompt_id=prompt_id,
            context=context,
            question=question,
            choices=choices,
            biased_answer=biased_answer,
            answer=answer,
        )
        result = check_korean_bias(model_name=model, data_args=args)
        return render(request, html_path, {"result": result})
