import os

SRC = r'c:\Users\princ\Desktop\Code Visualizer\src\features\visualizer\components\stages\CustomFlowchartStage.tsx'
STAGES_DIR = r'c:\Users\princ\Desktop\Code Visualizer\src\features\visualizer\components\stages'

content = open(SRC, encoding='utf-8').read()
print('Source read OK, size:', len(content))

JAVA_LANGUAGE_GUARD = "  if (language !== 'java' || !varName || !lessonLines) return undefined;"
PYTHON_LANGUAGE_GUARD = "  if (language === 'python' || !varName || !lessonLines) return undefined;"
JAVA_KEYWORDS = "['public','static','void','int','double','boolean','char','String']"
C_KEYWORDS = "['void','int','double','float','char']"
CPP_KEYWORDS = "['void','int','double','float','char','bool','auto','string']"

def make_stage(content, export_name, lang_guard, keywords, no_elif=True):
    s = content
    s = s.replace('export const CustomFlowchartStage: React.FC = () => {', f'export const {export_name}: React.FC = () => {{')
    s = s.replace(PYTHON_LANGUAGE_GUARD, lang_guard)
    s = s.replace("const isDef = line.tokens.some(t => t.type === 'keyword' && t.value === 'def');",
                  f"const isDef = line.tokens.some((t: any) => t.type === 'keyword' && {keywords}.includes(t.value));")
    s = s.replace("line.tokens.some((t: any) => t.type === 'keyword' && t.value === 'def')",
                  f"line.tokens.some((t: any) => t.type === 'keyword' && {keywords}.includes(t.value))")
    s = s.replace("const isHeader = line.tokens.some((t: any) => t.type === 'keyword' && t.value === 'def');",
                  f"const isHeader = line.tokens.some((t: any) => t.type === 'keyword' && {keywords}.includes(t.value));")
    if no_elif:
        s = s.replace("const isElif = line.tokens.some((t: any) => t.type === 'keyword' && t.value === 'elif');",
                      "const isElif = false;")
        s = s.replace("if (isElif) return 'Elif Block';", "// No elif in this language")
    return s

java = make_stage(content, 'JavaFlowchartStage', JAVA_LANGUAGE_GUARD, JAVA_KEYWORDS)
open(os.path.join(STAGES_DIR, 'JavaFlowchartStage.tsx'), 'w', encoding='utf-8').write(java)
print('Java done:', len(java))

c_stage = make_stage(content, 'CFlowchartStage', "  if (language !== 'c' || !varName || !lessonLines) return undefined;", C_KEYWORDS)
open(os.path.join(STAGES_DIR, 'CFlowchartStage.tsx'), 'w', encoding='utf-8').write(c_stage)
print('C done:', len(c_stage))

cpp_stage = make_stage(content, 'CppFlowchartStage', "  if (language !== 'cpp' || !varName || !lessonLines) return undefined;", CPP_KEYWORDS)
open(os.path.join(STAGES_DIR, 'CppFlowchartStage.tsx'), 'w', encoding='utf-8').write(cpp_stage)
print('Cpp done:', len(cpp_stage))

print('ALL DONE')
