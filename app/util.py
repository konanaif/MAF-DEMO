import MAF.algorithms.preprocessing as preprocessing
import MAF.algorithms.inprocessing as inprocessing
import MAF.algorithms.postprocessing as postprocessing
from MAF.algorithms.inprocessing.INTapt.intapt import mitigate_intapt
from MAF.algorithms.preprocessing.optim_preproc_helpers.data_prepro_function import (
    load_preproc_data_adult,
    load_preproc_data_german,
    load_preproc_data_compas,
    load_preproc_data_pubfig,
    load_preproc_data_celeba,
)

from MAF.metric.metric import get_metrics

from .context_processors import ALGORITHM_NAME2ID


def get_tabular_data_metric(data_name):
    if data_name == "compas":
        data = load_preproc_data_compas()
    elif data_name == "german":
        data = load_preproc_data_german()
    elif data_name == "adult":
        data = load_preproc_data_adult()
    metrics = get_metrics(data, data_name)
    return {
        "data_name": data_name,
        "data": metrics["data"],
        "performance": metrics["performance"],
        "classify": metrics["classify"],
    }


def get_image_data_metric(data_name):
    if data_name == "pubfig":
        data = load_preproc_data_pubfig()
    elif data_name == "celeba":
        data = load_preproc_data_celeba()
    metrics = get_metrics(data, data_name)
    return {
        "data_name": data_name,
        "data": metrics["data"],
        "performance": metrics["performance"],
        "classify": metrics["classify"],
    }


def load_audio_algorithm(algorithm_name: str):
    if algorithm_name == ALGORITHM_NAME2ID["INTapt"]:
        return mitigate_intapt()


def load_algorithm(data_name: str, algorithm_name: str):
    if algorithm_name == ALGORITHM_NAME2ID["DisparateImpactRemover"]:
        return preprocessing.disparate_impact_remover.DisparateImpactRemover(
            dataset_name=data_name, protected="sex", repair_level=1.0
        )
    if algorithm_name == ALGORITHM_NAME2ID["LearningFairRepresentation"]:
        return preprocessing.learning_fair_representation.LearningFairRepresentation(
            dataset_name=data_name, protected="sex"
        )
    if algorithm_name == ALGORITHM_NAME2ID["OptimPreproc"]:
        return preprocessing.optim_preproc.OptimPreproc(
            dataset_name=data_name, protected="sex"
        )
    if algorithm_name == ALGORITHM_NAME2ID["Reweighing"]:
        return preprocessing.reweighing.Reweighing(
            dataset_name=data_name, protected="sex"
        )
    if algorithm_name == ALGORITHM_NAME2ID["FairStreamingPCA"]:
        return preprocessing.fairpca.MeanCovarianceMatchingFairPCAWithClassifier(
            dataset_name=data_name, protected="sex"
        )
    if algorithm_name == ALGORITHM_NAME2ID["SLIDE"]:
        return inprocessing.slide.SlideFairClassifier(
            dataset_name=data_name, protected="sex"
        )
    if algorithm_name == ALGORITHM_NAME2ID["FTM"]:
        return inprocessing.ftm.FTMFairClassifier(
            dataset_name=data_name, protected="sex"
        )
    if algorithm_name == ALGORITHM_NAME2ID["FairDimensionFiltering"]:
        return inprocessing.fair_dimension_filtering.FairDimFilter(
            dataset_name=data_name
        )
    if algorithm_name == ALGORITHM_NAME2ID["FairFeatureDistillation"]:
        return inprocessing.fair_feature_distillation.FairFeatureDistillation(
            dataset_name=data_name
        )
    if algorithm_name == ALGORITHM_NAME2ID["ExponentiatedGradientReduction"]:
        return inprocessing.exponentiated_gradient_reduction.ExponentiatedGradientReduction(
            dataset_name=data_name, protected="sex"
        )
    if algorithm_name == ALGORITHM_NAME2ID["PrejudiceRemover"]:
        return inprocessing.prejudice_remover.PrejudiceRemover(
            dataset_name=data_name, protected="sex"
        )
    if algorithm_name == ALGORITHM_NAME2ID["MetaFairClassifier"]:
        return inprocessing.meta_classifier.MetaFairClassifier(
            dataset_name=data_name, protected="sex"
        )
    if algorithm_name == ALGORITHM_NAME2ID["LearningFromFairness"]:
        return inprocessing.learning_from_fairness.LearningFromFairness(
            dataset_name=data_name
        )
    if algorithm_name == ALGORITHM_NAME2ID["CalibratedEqOdds"]:
        return postprocessing.calibrated_eq_odds.CalibratedEqOdds(
            dataset_name=data_name, protected="sex"
        )
    if algorithm_name == ALGORITHM_NAME2ID["EqualizedOdds"]:
        return postprocessing.equalize_odds.EqOdds(
            dataset_name=data_name, protected="sex"
        )
    if algorithm_name == ALGORITHM_NAME2ID["RejectOptionClassifier"]:
        return postprocessing.reject_option_classification.RejectOptionClassifier(
            dataset_name=data_name, protected="sex"
        )
