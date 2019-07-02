# 让Python漫步在浏览器上


> 随着人工智能技术的普及，越来越多的前端程序员开始关注相关技术。Python 作为人工智能领域最常用的语言，与前端程序员日常使用的语言 JavaScript 同属脚本语言，且在两者发展过程中，社区也多有相互借鉴之处，因此有很多相似。一个熟悉 JavaScript 语言的前端程序员，通过掌握了他们之间的不同之处，可以快速上手 Python.

如何快速上手? 对于一个前端程序员来说, 如果能够在熟悉的浏览器环境下学习, 最好不过了. 所以, 那就手撸一个 [***Pathon*** 在线编程](https://www.yexiaochen.com/pythonOnline/). 而本文的重点则是本地文件的操作, 以下所有代码可见[**在线demo**](https://codepen.io/yexiaochen/pen/rowqYm).

# File API

## FileReader

******

将 ***File*** 和 ***Blob*** 类型的文件或数据异步读入内存.

### InstanceOfFileReader Properties

**instanceOfFileReader.`error(只读)`** : 在读取时的出现的错误.

**instanceOfFileReader.`readyState(只读)`** : 提供读取操作时的状态.

|Value(readyState)|State(FileReader)|Description|
|:---:|:---:|:---:|
|0|EMPTY|未加载任何数据|
|1|LOADING|加载数据中|
|2|DONE|已完成数据读取|

**instanceOfFileReader.`result(只读)`** : 读取的结果, 要么是 ***String***, 要么是 ***ArrayBuffer***, 这取决于读取的方法, 且仅在 ***load*** 事件触发后可用.

### InstanceOfFileReader Methods

**instanceOfFileReader.`abort()`** : 终止读取操作.

**instanceOfFileReader.`readAsArrayBuffer()`** : 以 ***ArrayBuffer*** 类型为输出结果进行读取.

**instanceOfFileReader.`readAsDataURL()`** : 以 ***Data URLs*** 类型为输出结果进行读取.

**instanceOfFileReader.`readAsText()`** : 以 ***String*** 类型为输出结果进行读取.

### InstanceOfFileReader Events

**`onloadstart/loadstart`** : 在读取操作开始时触发.

**`onprogress/progress`** : 在读取过程中触发以汇报当前读取进度.

**`onload/load`** : 在读取操作成功完成时触发.

**`onabort/abort`** : 因调用 `abort()` 而终止读取时触发.

**`onerror/error`** : 在读取时遇到错误时触发.

**`onloadend/loadend`** : 在读取操作完成时触发(无论成功或失败).

```HTML
  <!-- html -->
  <input type='file' onchange='openFile(event)'>
```

```JavaScript
  // js
  const stateNames = {
    [FileReader.EMPTY] : 'EMPTY',
    [FileReader.LOADING] : 'LOADING',
    [FileReader.DONE] : 'DONE'
  };
  let openFile = function(event) {
    let input = event.target;
    let reader = new FileReader();
    // 打开注解即可查看隐藏属性
    // reader.onloadstart = function() {
    //   reader.abort();
    // };
    reader.onprogress = function(e) {
      console.log('Event: ', e.type)
    };
    reader.onload = function(e) {
      console.log('Event: ', e.type)
    };
    reader.onloadend = function(e) {
      console.log('Event: ', e.type)
      console.log(reader.error.message);
    };
    reader.onabort = function(e) {
      console.log('Event: ', e.type)
    }
    reader.onerror = function(e) {
      console.log('Event: ', e.type)
      console.log(reader.error.message);
    }
    reader.onload = function(){
      let dataURL = reader.result;
      console.log('ReadyState: ' + stateNames[reader.readyState]);
      console.log('Result: ', dataURL)
    };
    console.log('ReadyState: ' + stateNames[reader.readyState]);
    // 打开注解即可查看隐藏属性
    // reader.readAsDataURL(input.files[0]);
    // reader.readAsArrayBuffer(input.files[0])
    reader.readAsText(input.files[0])
    console.log('ReadyState: ' + stateNames[reader.readyState]);
  };
```

## Blob

******

原始数据的不可变对象. ***File*** 就是衍生于 ***Blob***.
当 ***Blob*** 作为构造函数时, **`new Blob(blobParts, blobPropertyBag)`** 接受两个参数 :
=> ***blobParts*** : `ArrayBuffer`, `ArrayBufferView`, `Blob`, 或 `String` 对象类型之一.
=> ***blobPropertyBag({type, endings})*** : ***type***=> MIME类型. ***endings(transparent|native)*** => 用于指定包含行结束符 `\n` 的字符串如何被写入.

### InstanceOfBlob Properties

**instanceOfBlob.`size(只读)`** : 所包含数据的大小(以字节为单位).

**instanceOfBlob.`type(只读)`** : 所包含数据的MIME类型, 如果类型未知，则该值为空字符串.

### InstanceOfBlob Methods

**instanceOfBlob.`slice([start, [end, [contentType]]])`** : 创建基于原 ***Blob*** 对象指定字节范围内的数据的新 ***Blob*** 对象, 并赋予新 ***Blob*** 对象指定类型. 异于 `Array.slice()` 和 `String.slice()`

```JavaScript
  // js
  let blob = new Blob( new String('hello world'), {type: 'plain/text',endings: 'native'});
  let reader_1 = new FileReader();
  reader_1.onload = function() {
    let result = reader_1.result;
    console.log('result: ', result, 'type: ', blob.type, 'size: ', blob.size)
  }
  reader_1.readAsText(blob);
```

## File

******

***File*** 是 ***Blob*** 的一种特殊类型, 所以适用 ***Blob*** 的场景也同样适用于 ***File***.
***File*** 对象可以是来自用户在一个 `<input>` 元素上选择文件后返回的 ***FileList*** 对象, 也可以来自拖放操作生成的 ***DataTransfer*** 对象, 还可以是来自在一个 ***HTMLCanvasElement*** 上执行 `mozGetAsFile()` 方法后返回结果.
当 ***File*** 作为构造函数时, 较类似于 ***Blob***.
`new File(fileParts[, name[, filePropertyBag]])` 接受两个参数 :
=> ***fileParts*** : `ArrayBuffer`, `ArrayBufferView`, `Blob`, 或 `String` 对象类型之一.
=> ***name*** : 文件名称或文件路径.
=> ***blobPropertyBag({type, endings})*** : ***type***=> MIME类型. ***endings(transparent|native)*** => 用于指定包含行结束符 `\n` 的字符串如何被写入.

### InstanceOfFile Properties

**instanceOfFile.`lastModified(只读)`** : 当前文件最后修改时间, 自 1970年1月1日0:00 以来的毫秒数.
**instanceOfFile.`lastModifiedDate(只读)`** : 当前文件最后修改时间.
**instanceOfFile.`name(只读)`** : 当前文件的名称.
**instanceOfFile.`webkitRelativePath(只读)`** : 当前文件的路径.
**instanceOfFile.`size(只读)`** : 当前文件的大小(以字节为单位).
**instanceOfFile.`type(只读)`** : 当前文件的MIME类型.

### InstanceOfFile Methods

继承使用 ***Blob*** 的方法.

## FileReaderSync

******

以同步的方式读取 ***File*** 或 ***Blob*** 对象中的内容, 仅在 ***workers*** 里可用, 因为在主线程里进行同步 ***I/O*** 操作可能会阻塞用户界面. 有着和 ***FileReader*** 相同的读取方法.

## URL

******

提供了将 ***Blob*** 生成 ***url*** 的方法, 可使本地内容生成 ***url*** 传给接受 ***url*** 的 ***API***.

### URL Methods

**URL.`createObjectURL()`** : 为指定的 ***File*** 或 ***Blob*** 或 ***MediaSource*** 对象创建一个新的 ***url***.[Lifetime of blob URLs](https://w3c.github.io/FileAPI/#lifeTime)
**URL.`revokeObjectURL()`** : 释放之前生成的 ***url***.

```HTML
  <!-- html -->
  <input type='file' accept='image/*' onchange='uploadPicture(event)'>
  <div id='picture'></div>
```

```JavaScript
  // js
  let picture = document.getElementById('picture');
  let uploadPicture = function(event) {
  let target = event.target;
  let file = target.files[0];
  // URL
  let img = document.createElement('img');
  let url = URL.createObjectURL(file);
  img.width = 300;
  img.src = url;
  img.onload = function() {
    URL.revokeObjectURL(url);
  };
  picture.appendChild(img);

  // Auto download
  let downLink = document.createElement('a');
  let downUrl = URL.createObjectURL(file, { type: 'image/*' });
  downLink.download = `picture.png`;
  downLink.href = downUrl;
  downLink.click();
  URL.revokeObjectURL(downUrl);

  // FileReader
  let reader_3 = new FileReader();
  reader_3.onload = function() {
    let result = reader_3.result;
    let img = document.createElement('img');
    img.width = 300;
    img.src = result;
    picture.appendChild(img);
  }
  reader_3.readAsDataURL(file);
  }
```
