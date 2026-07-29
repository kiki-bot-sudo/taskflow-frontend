with open('src/replace_app.py', 'r', encoding='utf-8') as f:
    content = f.read()
start = content.find('new_content =') + 13
end = content.rfind('with open')
new_code = content[start:end].strip().strip('"""')
with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(new_code)
print('Done')