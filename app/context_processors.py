ALGORITHM_NAME2ID = {
    # tabular
    # preprocessing
    "DisparateImpactRemover": "dir",
    "LearningFairRepresentation": "lfr",
    "Reweighing": "rw",
    "OptimPreproc": "optimpreproc",
    "FairStreamingPCA": "fairpca",
    # inprocessing
    "MetaFairClassifier": "mfc",
    "PrejudiceRemover": "prejremover",
    "SLIDE": "slide",
    "FTM": "ftm",
    "ExponentiatedGradientReduction": "egr",
    "KernerlDensityEstimation": "kde",  # 카테고리 확인필요
    "GerryFairClassifier": "gfc",
    "AdversarialDebiasing": "ad",
    # postprocessing
    "CalibratedEqOdds": "ceo",
    "EqualizedOdds": "eo",
    "RejectOptionClassifier": "roc",
    # image-inprocessing
    "FairDimensionFiltering": "fdf",
    "FairFeatureDistillation": "ffd",
    "FairnessVAE": "fvae",
    "LearningFromFairness": "lff",
    # audio
    "INTapt": "intapt",
    # text
    "RepresentativenessHeuristic": "rh",
    "Latte": "latte",
    "CREHate": "crehate",
    "KoBBQ": "kobbq",
    "ConCSE": "concse",
}

ALGORITHM_ID2NAME = {
    ALGORITHM_NAME2ID[algo_id]: algo_id for algo_id in ALGORITHM_NAME2ID.keys()
}


def algorithm_id(request):
    return ALGORITHM_NAME2ID
