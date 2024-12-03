# MAF-DEMO
MAF-DEMO는 MAF의 기능을 담고있는 웹데모입니다.
![image](https://github.com/eeunz/MAF-DEMO/assets/110804596/675ab84c-20c3-48fa-bed1-4b3e1d41a7ee)

메인 화면의 구성은 다음과 같습니다.
- DATA SELECTION: 데이터 선택
- STATE OF THE ART, DESCRIPTION OF SOTA ALGORITHMS: 컨소시엄에서 제안한 알고리즘에 대한 간략한 소개
- ADVENTAGES: 프레임 워크의 특징 소개

## About

MAF-DEMO에서는 총 4가지 type(tabular, image, text, audio)의 데이터와 20개 이상의 알고리즘을 지원하고 있으며, 지속적으로 업데이트를 진행하고 있습니다.

## Setup
1. 저장소 복제
    ```bash
    git clone https://github.com/konanaif/MAF-DEMO.git
    ```
    MAF 폴더에 MAF 프레임워크를 다운로드 하고 MAF 프레임워크 설정에 맞추어 데이터를 다운받습니다.
    ``` bash
    git clone https://github.com/konanaif/MAF.git
    ```

2. 환경설정
    MAF의 원활한 구동을 위해서는 특정 버전의 패키지들이 필요합니다. 시스템의 다른 프로젝트와 충돌할 수 있으므로 anaconda 가상 환경 혹은 docker를 권장드립니다.
    - anaconda 가상 환경 사용 시, 가상 환경 생성 후 필요 패키지를 설치합니다.
      ```bash
      conda install --file requirements.txt
      ```
    - docker 이용 시, Dockerfile을 통해 이미지를 빌드합니다. MAF의 기본 작업 공간은 workspace 입니다.
      ```bash
      docker build -f Dockerfile -t maf:v1 ..
      ```

3. 환경변수 설정
   - 텍스트 데이터에 대한 알고리즘들은 외부 API를 이용하므로 API 이용을 위한 KEY 값을 설정합니다. 또한, MAF 구동을 위해 PYTHON 경로를 설정합니다.
     ```bash
      #OPENAI API KEY 설정 예시
      export OPENAI_API_KEY = 'your_api_key'
      #docker 사용 시 PYTHON 경로 설정 예시
      export PYTHONPATH = '/workspace'
      #Django SECRET KEY 설정
      export DJANGO_SECRET_KEY = 'your_django_key'
     ```

## How to use
### 1. Data Type Selection
<img src="https://github.com/user-attachments/assets/bbae9a75-b03e-418a-8126-b400743df5bc" alt="Data Type Select" style="width:70%; height:30%;">

데이터 타입 선택 화면입니다. MAF에서 지원하는 데이터 타입은 tabular, image, text, audio의 총 4가지입니다.
데이터 타입을 선택하면 각 타입에 해당하는 상세 데이터 혹은 알고리즘을 선택할 수 있는 페이지로 이동합니다.

### 2. Data Selection
<img src = "https://github.com/user-attachments/assets/30930ef6-9e96-41c0-8b02-4d59833fa041" alt="Data Select" style="width:70%; height:25%;">

데이터 선택 화면입니다. 각 데이터 타입 별로 알고리즘을 적용할 상세 데이터셋을 선택합니다.
* Custom dataset 선택 시 제한사항
  * csv 파일만 업로드 가능하며, 데이터에는 Target, Bias 열이 반드시 하나씩 존재해야합니다.

CHECK METRIC 버튼을 클릭 시, 데이터에 대한 T-SNE analysis, bias measure 및 SVM을 거친 이후의 bias measure를 확인할 수 있습니다.
SELECT MITIGATION ALGORITHM 버튼을 클릭하면, 편향성 완화 알고리즘을 선택화면으로 이동합니다.

#### CHECK METRIC
##### Data metrics
<img src = "https://github.com/user-attachments/assets/cd4f1f9d-3e41-47bd-bca8-16ebd349d310" alt="Data metric" style="width:70%; height:25%;">
<img src = "https://github.com/user-attachments/assets/2571e045-b75f-4092-9ca2-b3e5d713b67c" alt="t-SNE" style="width:70%; height:25%;">

##### Performance
<img src = "https://github.com/user-attachments/assets/ba3e8a77-83d4-4985-ac37-d84491617475" alt="Performance metric" style="width:70%; height:25%;">

##### Classification metrics
<img src = "https://github.com/user-attachments/assets/645f788d-c6b2-491f-b304-faade6c3e821" alt="Classification metric" style="width:70%; height:25%;">

### 3. Algorithm Selection
편향성 완화 알고리즘 선택 화면입니다. ⓘ 버튼을 클릭하여 각 모델에 대한 간략한 설명을 확인할 수 있습니다.
AIF360의 알고리즘과 컨소시엄에서 개발한 알고리즘을 포함하고 있으며, 지속적으로 업데이트를 진행하고 있습니다.

<img src = "https://github.com/user-attachments/assets/68c8b584-28e8-4d0a-bdcf-42e4e07a386e" alt="Algorithm selection" style="width:70%; height:25%;">

### 4. Check Mitigated Result
선택한 데이터와 알고리즘에 따른 결과를 확인할 수 있습니다.
- Example
  - Tabular data: <b>Compas</b>, Algorithm: <b>Disparate Impact Remover</b>
  <img src = "https://github.com/user-attachments/assets/12756675-0b65-42aa-af62-086476600050" alt="Tabular example" style="width:70%; height:25%;">

  - Image data: <b>Pubfig</b>, Algorithm: <b>Fair Feature Distillation</b>
  <img src = "https://github.com/user-attachments/assets/ce767581-b7c9-4677-b60c-2c43e71d8a9e" alt="Image example" style="width:70%; height:25%;">

  - Text Benchmark: <b>KoBBQ</b>
  <img src = "https://github.com/user-attachments/assets/8ba6adf3-e00e-467e-9d9c-c01260478dc0" alt="Text example" style="width:70%; height:25%;">

  - Audio algorithm: <b>INTapt</b>
  <img src = "https://github.com/user-attachments/assets/5a582374-0444-41b7-bb1f-af2cbf89c0b7" alt="Audio example" style="width:70%; height:25%;">

