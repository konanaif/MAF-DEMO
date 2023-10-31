# MAF-DEMO
MAF-DEMO는 MAF의 기능을 담고있는 웹데모입니다. 
![image](https://github.com/eeunz/MAF-DEMO/assets/110804596/675ab84c-20c3-48fa-bed1-4b3e1d41a7ee)


## About
MAF-DEMO는 현재 실시간 운영을 위해 준비된 웹 서비스가 아닙니다. 이를 달성하려면 추가 단계가 필요합니다.


MAF-DEMO 에는 현재 3개의 tablu 데이터와 1개의 이미지 데이터가 포함되어 있습니다. 또한 14개의 알고리즘을 포함하고 있으며 앞으로도 계속 보완할 예정입니다.
* Data : COMPAS, German credit scoring, Adult census income, Public Figures Face Database(Image)
* Algorithm : Disparate_Impact_Remover, Learning_Fair_Representation, Reweighing, Gerry_Fair_Classifier, Meta_Fair_Classifier, Prejudice_Remover, FairBatch, FairFeatureDistillation(Image only), FairnessVAE(Image only), KernelDensityEstimator, LearningFromFairness(Image only)

## Setup
```bash
git clone https://github.com/konanaif/MAF-DEMO.git
```

## How to use
### 1. Data selection
![image](https://github.com/eeunz/MAF-DEMO/assets/110804596/2385e86d-68ff-4fbb-9060-6c0514aacc9d)

샘플 데이터 선택 화면입니다. 현재 Sample 디렉토리에 적합한 파일이 있어야 제대로 실행되며, 데이터는 Preset sample 4가지, Custom dataset 1가지 선택 가능합니다.
* Custom dataset 선택 시 제한사항
  * csv 파일만 업로드 가능하며, 데이터에는 Target, Bias 열이 반드시 하나씩 존재해야합니다.

### 2. Metric
Data 자체 Bias measures와 Base model (SVM) bias measures, T-SNE analysis를 차트와 테이블로 표현합니다.

#### Data metrics
![image](https://github.com/eeunz/MAF-DEMO/assets/110804596/a3929d84-9094-4a76-bd5f-ce8ea6b1d462)
![image](https://github.com/eeunz/MAF-DEMO/assets/110804596/9e0f8ff8-cbfe-444c-b7c7-058e2fc1738c)

#### Performance
![image](https://github.com/eeunz/MAF-DEMO/assets/110804596/802f3cad-db27-4448-ba13-d2a2d4b30b4f)
![image](https://github.com/eeunz/MAF-DEMO/assets/110804596/2bad02c3-f1ff-4a2a-9c18-35afc0eaf977)

#### Classification metrics
![image](https://github.com/eeunz/MAF-DEMO/assets/110804596/5fc92a47-cffe-4b44-aad1-2caff22042f4)
![image](https://github.com/eeunz/MAF-DEMO/assets/110804596/642b5c3b-c8d2-48a0-a9bf-6901ed666e23)



### 3. algorithm select
![image](https://github.com/eeunz/MAF-DEMO/assets/110804596/48daef24-be8e-4c87-8a8f-27e7ccb53687)

편향성 완화 알고리즘 선택 화면입니다. 현재 AIF360의 알고리즘과 컨소시엄에서 개발한 알고리즘을 포함하고 있으며, 향후 추가할 예정입니다. SOTA 알고리즘 중 일부는 Image data로만 활용 가능하며, 현재 Image data는 Pubfig 데이터만 존재합니다. Pubfig 가 아닐 경우 해당 알고리즘들은 disabled 됩니다.


### 4. compare models
![image](https://github.com/eeunz/MAF-DEMO/assets/110804596/b51ab9ad-cfc4-4b79-9d0a-032b9ae00f50)

알고리즘을 선택하면 base model 과 mitigated model 간의 결과를 비교합니다.
