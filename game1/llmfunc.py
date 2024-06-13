from transformers import pipeline
classifier = pipeline("zero-shot-classification", model="MoritzLaurer/mDeBERTa-v3-base-mnli-xnli")
def save_dialog_to_sequence(dialog: str):
    sequence_to_classify=""
    sequence_to_classify += dialog + " "
    print(sequence_to_classify.strip())
    return sequence_to_classify
#sequence_to_classify="這是一個測試"
candidate_labels = ["一視同仁",
"不善社交",
"友善",
"包容",
"可靠",
"多才多藝",
"有上進心",
"有主見",
"有同理心",
"有好奇",
"有行動力",
"有求知欲",
"有抱負",
"有洞察力",
"有責任性",
"有想像力",
"有愛心",
"有感染力",
"有領導力",
"有適應力",
"有魅力",
"有邏輯力",
"自信",
"冷靜",
"完美主義",
"和諧",
"直覺",
"社會性",
"長遠",
"勇敢",
"耐心",
"效率主義",
"國際性",
"堅持",
"專注",
"敏銳",
"理性",
"細心",
"創新",
"創意",
"善於交談",
"有條理",
"喜歡自由",
"喜歡社交",
"喜歡挑戰",
"喜歡競爭",
"策略性",
"開放",
"雄心勃勃",
"勤奮",
"感性",
"實際",
"慷慨",
"精力充沛",
"精明",
"認真",
"樂於助人",
"樂觀",
"踏實",
"機智",
"隨性",
"謹慎",
"靈活",
"有協調力"]
def analysis(sequence_to_classify:str):
    output = classifier(sequence_to_classify, candidate_labels, multi_label=False)
    print(output)

#force_download = True 強迫再次下載model
#"接受陌生人加入隊伍"
#要跑30s, 會根據label影響速度, if label less than 10, run 10s
#結果是dict, 由大至小排
#要載transformrs and pytorch