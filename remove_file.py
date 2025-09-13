import os
import fnmatch

def remove_files(root_path, includes, excludes):
    """
    删除 root_path 下，匹配 includes 模式但不在 excludes 中的文件。
    参数：
      - root_path (str): 起始搜索路径
      - includes (List[str]): shell-style 模式列表，如 ['*.tmp', '*.log']
      - excludes (List[str]): 模式列表，优先级更高，如 ['important.log']
    """
    for dirpath, dirnames, filenames in os.walk(root_path):
        for name in filenames:
            src = os.path.join(dirpath, name)
            # 判断是否匹配 includes
            matched_in = any(fnmatch.fnmatch(name, pat) for pat in includes)
            if not matched_in:
                continue
            # 排除 excludes
            matched_ex = any(fnmatch.fnmatch(name, pat) for pat in excludes)
            if matched_ex:
                print(f"跳过（exclude匹配）：{src}")
                continue
            # 执行删除
            # print(f"删除：{src}")
            os.remove(src)

if __name__ == "__main__":
    root = "."
    includes = ["*.lock","*.yaml"]
    excludes = ["*.tsx"]

    remove_files(root, includes, excludes)