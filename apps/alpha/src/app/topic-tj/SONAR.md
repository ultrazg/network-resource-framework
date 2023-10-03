# CSS
## font-family
```
font-family: 'FZZDHJW';
```

```
font-family: 'FZZDHJW', sans-serif;
```
- 字体后面带上sans-serif;

## 重复属性

```
color: -webkit-linear-gradient(180deg, #29fdff 0%, #007fae 88%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
color: #00feff;
```
```
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
color: #00feff;
```
- 删除重复属性

## 有效的linear-gradient
```
.foo {
  background: -webkit-linear-gradient(to top, #fff, #000);
  background: linear-gradient(top, #fff, #000);
}

.bar {
  background: linear-gradient(45, #fff, #000);
}
```
```
.foo {
  background: -webkit-linear-gradient(top, #fff, #000);
  background: linear-gradient(to top, #fff, #000);
}

.bar {
  background: linear-gradient(45deg, #fff, #000);
}
```

# JS
## map循环
```
roomTypeList.map((item) => {
    if (item.value === e.network) setNewText(item.label)
})
```
```
roomTypeList.forEach((item) => {
    if (item.value === e.network) setNewText(item.label)
})
```
- 不用返回数组时，用forEach

## 意外的空箭头函数
```
const handleReset = () => {
}
```
```
const handleReset = () => {
  // handleReset
}
```
- 空箭头函数补充方法
