var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');

// 常量定义
var GetURL = 'https://www.umei.cc/meinvtupian/xingganmeinv/';

// 发起请求
// var options = {
//     url: GetURL,
//     headers: {
//         'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
//         'Referer': 'http://huaban.com/'
//     }
// };
request(GetURL, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    // console.log(body);    //返回请求页面的HTML
    acquireData(body);
    }
});

// 解析得到图片列表
function acquireData(data) {
    // cheerio解析data
    var $ = cheerio.load(data);
    // 将所有的img放到一个数组中
    var imgList = $('.TypeBigPics img').toArray();
    fs.mkdir('images', '0777', function(){
        console.log('Images文件夹创建成功！');
    });
    // console.log(imgList);
    var len = imgList.length;
    // 循环图片src
    for (var i=0; i<len; i++) {
        var imgsrc = imgList[i].attribs.src;
        console.log('图片地址' + imgsrc);
        var saveName = getFileName(imgsrc);
        console.log(saveName)
        downloadImg(imgsrc, saveName, function() {
            console.log(saveName + ' 下载完成！');
        });
    }
}

// 解析获取图片名称
function getFileName(url) {
  // var filename = path.basename(url);
  var filename = 'images/' + Math.floor(Math.random() * 1e6) + '.jpg';
  return filename;
}

// 下载图片
var downloadImg = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        // console.log('content-type:', res.headers['content-type']);  //这里返回图片的类型
        // console.log('content-length:', res.headers['content-length']);  //图片大小
        if (err) {
            console.log('err: '+ err);
            return false;
        }
        // console.log('res: '+ res);
        request(uri).pipe(fs.createWriteStream(filename));  //调用request的管道来下载到 images文件夹下
    });
};
