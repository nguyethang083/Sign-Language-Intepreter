from spoken_to_signed.bin import _text_to_gloss, _gloss_to_pose, _pose_to_video
from pose_format import Pose
from pose_format.pose_visualizer import PoseVisualizer
import underthesea

LEXICON_DIR = "assets/"
POSE_FOLDER = {
    "vsl": "vi_lexicon",
}

def vi_gloss(text):
    text = underthesea.text_normalize(text)
    token = underthesea.pos_tag(text)
    
    gloss = []
    for word in token:
        if word[1] == "P":
            gloss.append((word[0], word[0]))
            
    for word in token:
        if word[1] == "N" or word[1] == "M":
            gloss.append((word[0], word[0]))
        
    for word in token:
        if word[1] == "V":
            gloss.append((word[0], word[0]))
            
    for word in token:
        if word[1] != "V" and word[1] != "N" and word[1] != "P" and word[1] != "M":
            gloss.append((word[0], word[0]))
            
    gloss = [gloss]
    return gloss
    
def to_pose(text, output_dst, src_lang="vi", dst_lang="vsl", glosser="simple"):
    '''
    text: input sentence
    output_dst: name of the .pose output file
    src_lang: ['de', 'fr', 'it', 'en'] input language
    dst_lang: ['sgg', 'gsg', 'bfi', 'ase'] output language
    glosser: ['simple', 'spacylemma', 'rules', 'nmt'] glossing technique. current implementation only supports 'simple' - simple lookup from spoken to gloss
    '''
    lexicon = LEXICON_DIR + \
        POSE_FOLDER[dst_lang]  # directory of the translated lexicon, including indexing csv

    if src_lang == "vi":
        sentences = vi_gloss(text)
    else:
        sentences = _text_to_gloss(text, src_lang, glosser)
    pose = _gloss_to_pose(sentences, lexicon, src_lang, dst_lang)

    with open(output_dst, "wb") as f:
        pose.write(f)

    # print("Text to gloss to pose")
    # print("Input text:", text)
    # print("Output pose:", pose)


def to_video(text, output_dst, src_lang="de", dst_lang="sgg", glosser="simple"):
    #TODO
    
    lexicon = LEXICON_DIR + "dummy_lexicon"

    sentences = _text_to_gloss(text, src_lang, glosser)
    pose = _gloss_to_pose(sentences, lexicon, src_lang, dst_lang)

    _pose_to_video(pose, output_dst)

    # print("Text to gloss to pose to video")
    # print("Input text:", text)
    # print("Output video:", output_dst)

def show_pose(pose_file):
    '''
    pose_file: .pose file to visualize
    '''
    
    with open("quick_test.pose", "rb") as f:
        p = Pose.read(f.read())

    # Resize to 256, for visualization speed
    scale = p.header.dimensions.width / 256
    p.header.dimensions.width = int(p.header.dimensions.width / scale)
    p.header.dimensions.height = int(p.header.dimensions.height / scale)
    p.body.data = p.body.data / scale

    # Genearate .gif
    v = PoseVisualizer(p)

    v.save_gif("quick_test.gif", v.draw())