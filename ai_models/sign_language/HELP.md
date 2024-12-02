# THIS IS A BRIEF DESCRIPTION FOR HOW THESE WORK

## Dependencies

- pose-format>=0.4.1
- numpy,
- scipy
- simplemma>=1.0.0

### Optional

- pose_anonymization @ git+<https://github.com/sign-language-processing/pose-anonymization>
- spacy
- sentencepiece
- sockeye==3.1.10
- sign-language-datasets
- gcsfs


## How to use

- All plug-in functions are located in utils.py. Import utils.py to translate spoken to signed in other parts of the pipelines
- To translate a sentence into a pose use `to_pose()`. This function will output a .pose file, all required args are notated inside the function
- To visulize a .pose into a .gif file use `show_pose()`

## Note

- Currently support default languages from the original repo only
- Currently used lemmatizer (text to gloss) is `simple` - simply look-up word by word in the gloss directory
- Other developing lemmatizers are specified in `README.md`, including Neural Machine Translation System. Haven't tested any of these
- .pose to .mp4 hasn't work
- Look into `README.md` for more description on the work, and `pyproject.toml` for dependencies and env notes.

## TODO (SOS)

### Adding Vietnamese

- Find VSL(Vietnamese Sign Language) videos to process into lexicon. Possible source: <https://qipedc.moet.gov.vn/dictionary> or <https://tudienngonngukyhieu.com> (need curl videos), <https://drive.google.com/drive/folders/1ZSNhcv2CpJkThjh9kcLXs6WqRrYJqszL>. Preferable use the 2nd link. 
- The library of `simple` lemmatizer, which is `simplemma`, doesn't support Vietnamese. Need to test other lemmatizer or build lemmatizer for Vietnamese (probably most time consuming task)

Update 1: Vietnamese doens't have prefix or suffix so no need lemmatized(?), need segmented only (use `underthesea`)

### Adding English

- Find lexicons or usable repos.

## Explain

- The example lexicon (dictionary) is located in `\assets\dummy_lexicon`. This folder includes `\sgg` - lists of preprocessed poses, and `index.csv` - mapping word to its .pose file's location, e.g esse - "sgg/essen.pose". See this folders for more understanding
- First the sentences are translate into glosses using lemmatizer. Next, the glosses are then mapped to their poses (using index.csv). Finally, the poses are sequentially concatenated to create the full pose of the source sentence and save as a new .pose