 //  拼接时在所有的upload前面加上
 $(document).ready(function() {
     $.ajax({
         url: "JSON3.json", //同文件夹下的json文件路径
         type: "GET", //请求方式为get
         dataType: "json", //返回数据格式为json
         // contentType: "application/json;charset=UTF-8",
         success: function(data) { //请求成功完成后要执行的方法 
             // 问题名称、常识名称2
             var $firstName = $("#message_head_name");
             var str2 = "";
             $firstName.empty();
             str2 = `<span>` + data.data.title + `</span>`;
             $firstName.html(str2);

             // 发布时间3
             var $firstTime = $("#message_head_time");
             var str3 = "";
             $firstTime.empty();
             str3 = `<span>` + data.data.issue_date + `</span>`;
             $firstTime.html(str3);
             // 发布内容4
             var $firstContent = $("#message_content_word");
             var str4 = "";
             $firstContent.empty();
             str4 = data.data.contents;
             $firstContent.html(str4);

             // 发布图片5
             var $firstPhoto = $("#message_content_img");
             var str5 = "";
             var firstImgurlLength = data.data.imageUrl.length;
             switch (firstImgurlLength) { //根据发布图片数量，选择不同的排列展示方式
                 case 1:
                     str5 = `<img id="message_content_imgs" class="message_content_imgs one" src="http://mirror.aqydt.cn:8072/ydt1.5` + data.data.imageUrl[0] + `" alt="">`;
                     $firstPhoto.html(str5);
                     break;
                 case 2:
                     for (var i = 0; i < 2; i++) {
                         str5 += `<img id="message_content_imgs" class="message_content_imgs two" src="http://mirror.aqydt.cn:8072/ydt1.5` + data.data.imageUrl[i] + `" alt="">`;
                     }
                     $firstPhoto.html(str5);
                     break;
                 case 3:
                 case 4:
                 case 5:
                 case 6:
                 case 7:
                 case 8:
                 case 9:
                     for (var i = 0; i < firstImgurlLength; i++) {
                         str5 += `<img id="message_content_imgs" class="message_content_imgs three" src="http://mirror.aqydt.cn:8072/ydt1.5` + data.data.imageUrl[i] + `" alt="">`;
                     }
                     $firstPhoto.html(str5);
                     break;
                 default:
                     str5 = "";
                     $firstPhoto.html(str5);
             }
             // 点击放大发布图片
             //发布的图片 message_content_imgs
             var $messageContentImgs = $("img[id='message_content_imgs']");
             // console.log($messageContentImgs);
             $messageContentImgs.each(function(index, obj) { //遍历获取到的图片数组
                 $(this).click(function(event) { //点击图片事件发生时，获得到当前图片
                     event = event || window.event;
                     var target = document.elementFromPoint(event.clientX, event.clientY);
                     var scroll = $(window).scrollTop();
                     showBig(target.src, index, scroll); //调用showBig函数并传递两个参数，一个是当前图片的src，一个是当前图片的index值
                 });
                 //放大展示发布的图片


                 function showBig(src, index, scroll) {
                     $("#popup img").attr("src", src); // 修改弹出层中img的src以放大显示当前被点击的图片
                     $("#popup").css({
                         "display": "block" //将弹出层显示出来
                     });
                     $('#showBigImg').removeClass("animate__zoomIn");
                     //  console.log(scroll);
                     $("html,body").css({
                         "position": "fixed",
                         "top": -scroll,
                         "left": "50vw"
                     }); //相对于窗口定位弹窗，距离顶部的距离等于页面滚动的距离，这样就不会出现点击回到顶部的情况
                     $("#popup").click(function() { //再次点击弹出层，隐藏掉
                         $("#popup").css({
                             "display": "none"
                         });
                         $('#showBigImg').addClass("animate__zoomIn");
                         $("#showBigImg").attr("src", "");
                         $("html,body").css({
                             "position": "", //去除相对于窗口的定位     
                             "top": "",
                             "left": ""
                         });
                         $(window).scrollTop(scroll); //恢复浏览器原来的滚动距离

                     });

                     // 监听滑动屏幕事件，x值减小，index++；x值增加，index--；
                     // touchmove的最后坐标减去touchstart的起始坐标，X的结果如果正数，则说明手指是从左往右划动；X的结果如果负数，则说明手指是从右往左划动；Y的结果如果正数，则说明手指是从上往下划动；Y的结果如果负数，则说明手指是从下往上划动。
                     //popup 是需要左右滑动的元素类名
                     $("#popup").unbind("touchstart").on("touchstart", function(e) { //先解除绑定touchstart：unbind()，再重新绑定touchstart：on()，避免出现累加绑定事件
                         startX = e.originalEvent.changedTouches[0].pageX, //手指X轴起始位置
                             startY = e.originalEvent.changedTouches[0].pageY; //手指Y轴起始位置
                         // console.log(e);
                     });
                     $("#popup").unbind("touchend").on("touchend", function(e) {
                         moveEndX = e.originalEvent.changedTouches[0].pageX, //手指X轴离开位置
                             moveEndY = e.originalEvent.changedTouches[0].pageY, //手指Y轴起始位置
                             X = moveEndX - startX, //左右滑动的距离
                             Y = moveEndY - startY; //上下滑动的距离
                         if (X > 50) { //X大于0表示左滑，大于50的原因是为了让页面不会那么敏感
                             //左滑操作 -- 
                             if (index > 0) {
                                 index--;
                                 if (index == -1) {
                                     index += 1;
                                     // 返回最终值，避免因为index值符合条件重复进入循环
                                     return 0;
                                 }
                                 // data.data.imageUrl[index]

                                 //滑动切换图片动画
                                 $('#showBigImg').addClass("animate__fadeInLeftBig");
                                 setTimeout(function() {
                                     $('#showBigImg').removeClass('animate__fadeInLeftBig animate__zoomIn');
                                 }, 501);
                                 $('#showBigImg').attr("src", data.data.imageUrl[index]); //根据改变的index值，去JSON数据中取得对应的图片src
                                 // $('#showBigImg').attr("class", "animate__animated animate__zoomIn ");

                             }
                         } else if (X < -50) { //X小于0表示右滑，小于50的原因同左滑
                             //右滑操作 ++
                             if (index < data.data.imageUrl.length) {
                                 index++;
                                 if (index == data.data.imageUrl.length) {
                                     index -= 1;
                                     return data.data.imageUrl.length; // 返回最终值，避免因为index值符合条件重复进入循环
                                 }
                                 //滑动切换图片动画
                                 $('#showBigImg').addClass("animate__fadeInRightBig");
                                 setTimeout(function() {
                                     $('#showBigImg').removeClass('animate__fadeInRightBig animate__zoomIn');
                                 }, 501);
                                 $('#showBigImg').attr("src", data.data.imageUrl[index]); //根据改变的index值替换图片src
                             }
                         }
                     });
                 }
             });
         }
     })
 });