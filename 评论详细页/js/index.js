 //  拼接时在所有的upload前面加上
 $(document).ready(function() {
     $.ajax({
         url: "JSON2.json", //同文件夹下的json文件路径
         type: "GET", //请求方式为get
         dataType: "json", //返回数据格式为json
         // contentType: "application/json;charset=UTF-8",
         success: function(data) { //请求成功完成后要执行的方法 
             // 留言人头像1
             // 获取第一个头像的div

             var $firstAvatar = $("#first_avatar");
             // 存储数据的变量 
             var str1 = "";
             // 清空内容 
             $firstAvatar.empty();
             str1 = `<img  class="avatar" src="` + data.data[0].header + `" alt="">`;
             $firstAvatar.html(str1);

             // 留言人昵称2
             var $firstName = $("#message_head_name");
             var str2 = "";
             $firstName.empty();
             str2 = `<span>` + data.data[0].nickname + `</span>`;
             $firstName.html(str2);

             // 留言时间3
             var $firstTime = $("#message_head_time");
             var str3 = "";
             $firstTime.empty();
             str3 = `<span>` + data.data[0].timestamp + `</span>`;
             $firstTime.html(str3);
             // 留言内容4
             var $firstContent = $("#message_content_word");
             var str4 = "";
             $firstContent.empty();
             str4 = data.data[0].contents;
             $firstContent.html(str4);

             // 留言图片5
             var $firstPhoto = $("#message_content_img");
             var str5 = "";
             var firstImgurlLength = data.data[0].imageUrl.length;
             switch (firstImgurlLength) { //根据留言图片数量，选择不同的排列展示方式
                 case 1:
                     str5 = `<img id="message_content_imgs" class="message_content_imgs one" src="` + data.data[0].imageUrl[0] + `" alt="">`;
                     $firstPhoto.html(str5);
                     break;
                 case 2:
                     for (var i = 0; i < 2; i++) {
                         str5 += `<img id="message_content_imgs" class="message_content_imgs two" src="` + data.data[0].imageUrl[i] + `" alt="">`;
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
                         str5 += `<img id="message_content_imgs" class="message_content_imgs three" src="` + data.data[0].imageUrl[i] + `" alt="">`;
                     }
                     $firstPhoto.html(str5);
                     break;
                 default:
                     str5 = "";
                     $firstPhoto.html(str5);
             }
             // 点击放大留言图片
             //留言的图片 message_content_imgs
             var $messageContentImgs = $("img[id='message_content_imgs']");
             // console.log($messageContentImgs);
             $messageContentImgs.each(function(index, obj) { //遍历获取到的图片数组
                 $(this).click(function(event) { //点击图片事件发生时，获得到当前图片
                     event = event || window.event;
                     var target = document.elementFromPoint(event.clientX, event.clientY);
                     var scroll = $(window).scrollTop();
                     showBig(target.src, index, scroll); //调用showBig函数并传递两个参数，一个是当前图片的src，一个是当前图片的index值
                 });
                 //放大展示留言的图片


                 function showBig(src, index, scroll) {
                     $("#popup img").attr("src", src); // 修改弹出层中img的src以放大显示当前被点击的图片
                     $("#popup").css({
                         "display": "block" //将弹出层显示出来
                     });
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
                                 // data.data[0].imageUrl[index]
                                 $('#showBigImg').attr("src", data.data[0].imageUrl[index]); //根据改变的index值，去JSON数据中取得对应的图片src
                             }
                         } else if (X < -50) { //X小于0表示右滑，小于50的原因同左滑
                             //右滑操作 ++
                             if (index < data.data[0].imageUrl.length) {
                                 index++;
                                 if (index == data.data[0].imageUrl.length) {
                                     index -= 1;
                                     return data.data[0].imageUrl.length; // 返回最终值，避免因为index值符合条件重复进入循环
                                 }
                                 $('#showBigImg').attr("src", data.data[0].imageUrl[index]); //根据改变的index值替换图片src
                             }
                         }
                     });
                 }
             });



             // 评论回复数量6
             var $contentAmount = $("#message_content_amount");
             var str6 = "";
             $contentAmount.empty();
             str6 = data.data.length - 1;
             $contentAmount.html(str6);
             // 留言评论7
             var $comments = $("#comments");
             var dataLength = data.data.length;
             switch (dataLength) {
                 // 没有评论，隐藏框框
                 case 1:
                     $comments.css('display', 'none');
                     break;
                     // 有评论，利用JSON的内容拼接标签
                 default:
                     // 评论头像
                     var $userAvatar = $("#user_avatar"); //data.data[i].header
                     // 评论人昵称
                     var $commentsName = $("#comments_name"); //data.data[i].nickname
                     // 评论时间
                     var $commentsTime = $("#comments_time"); //data.data[i].timestamp
                     // 评论内容
                     var $commentsContent = $("#comments_content"); //data.data[i].contents
                     // 评论图片
                     var $commentsImg = $("#comments_img"); //data.data[i].imageUrl[j]        
                     var str7 = "";
                     // 判断图片数量，确定显示方式，拼接标签
                     for (var i = 1; i < dataLength; i++) {
                         str7 += `<div id="comments_box" class="comments "><div class="comments_person">
                    <!-- 评论头像 -->
                    <div id="user_avatar" class="user_avatar ">
                        <img id="follow_avatar" class="avatar " src="` + data.data[i].header + `" alt="">
                    </div>
                    <!-- 评论人昵称 -->
                    <div id="comments_name" class="comments_name ">
                        <span>` + data.data[i].nickname + `</span>
                    </div>
                    <!-- 评论时间 -->
                    <div id="comments_time" class="comments_time "><span>` + data.data[i].timestamp + `</span></div>
                </div>
                <!-- 评论内容 -->
                <div id="comments_content" class="comments_content ">` + data.data[i].contents + `</div>
                <!-- 评论图片-->
                <div id="comments_img" class="comments_img" name="` + data.data[i].id +
                             `">`;
                         var CommentsimageUrlLength = data.data[i].imageUrl.length; //获取到第i个评论图片数量
                         var str8 = '';
                         for (var j = 0; j < 1; j++) { // 根据每条评论的图片数量，选择不同的排列展示方式
                             switch (CommentsimageUrlLength) {
                                 case 1: //图片有一个
                                     str8 = `<img id="comments_imgs" class="comments_imgs comImg_one" src="` + data.data[i].imageUrl[0] + `" alt="">`;
                                     break;
                                 case 2: //图片有两个
                                     for (var z = 0; z < CommentsimageUrlLength; z++) {
                                         str8 += `<img id="comments_imgs" class="comments_imgs comImg_two" src="` + data.data[i].imageUrl[z] + `" alt="">`;
                                     }
                                     break;
                                 case 3: //图片有三个至九个
                                 case 4:
                                 case 5:
                                 case 6:
                                 case 7:
                                 case 8:
                                 case 9:
                                     for (var z = 0; z < CommentsimageUrlLength; z++) {
                                         str8 += `<img id="comments_imgs" class="comments_imgs comImg_three" src="` + data.data[i].imageUrl[z] + `" alt="">`;
                                     }
                                     break;
                                 default:
                                     str8 = "";
                             }
                             str7 += str8;
                         }
                         str7 += `</div>
                <div class="clear"></div></div>`;
                         $comments.html(str7);
                     }
                     //  console.log($("img[id='comments_imgs']"));
                     //评论的图片 comments_imgs
                     var commentsImgs = $("img[id='comments_imgs']");
                     commentsImgs.each(function(index, obj) {
                         $(this).click(function(event) {
                             event = event || window.event;
                             var target = document.elementFromPoint(event.clientX, event.clientY);
                             //  var newImgName = $(this).parent("div").attr("name");//获取父div的name的值
                             var newImgName = $(this).parent("div").children("img"); //获取到被点击图片的div中的所有图片
                             var newImgIndex = $(this).index(); //index()函数：如果不给 .index() 方法传递参数，那么返回值就是这个jQuery对象集合中第一个元素相对于其同辈元素的位置
                             var scroll = $(window).scrollTop();
                             showBig(target.src, newImgIndex, newImgName, scroll); //向showBig函数传递参数
                         });
                     });


                     function showBig(src, newImgIndex, newImgName, scroll) { //接收参数，放大图片，并滑动
                         $("#showBigImg2").attr("src", src);
                         $("#popup2").css({
                             "display": "block"
                         });
                         $("html,body").css({
                             "position": "fixed",
                             "top": -scroll,
                             "left": "50vw"
                         }); //相对于窗口定位弹窗，距离顶部的距离等于页面滚动的距离，这样就不会出现点击回到顶部的情况

                         $("#popup2").click(function() {
                             $("#popup2 ").css({
                                 "display": "none"
                             });
                             $("#showBigImg2").attr("src", "");
                             $("html,body").css({
                                 "position": "", //去除相对于窗口的定位     
                                 "top": "",
                                 "left": ""
                             });
                             $(window).scrollTop(scroll); //恢复浏览器原来的滚动距离
                         });

                         $("#popup2").unbind("touchstart").on("touchstart", function(e) { //先解除绑定touchstart：unbind()，再重新绑定touchstart：on()，避免出现累加绑定事件
                             startX = e.originalEvent.changedTouches[0].pageX, //手指X轴起始位置
                                 startY = e.originalEvent.changedTouches[0].pageY; //手指Y轴起始位置
                             // console.log(e);
                         });
                         $("#popup2").unbind("touchend").on("touchend", function(e) {
                             moveEndX = e.originalEvent.changedTouches[0].pageX, //手指X轴离开位置
                                 moveEndY = e.originalEvent.changedTouches[0].pageY, //手指Y轴起始位置
                                 X = moveEndX - startX, //左右滑动的距离
                                 Y = moveEndY - startY; //上下滑动的距离
                             if (X > 50) { //X大于0表示左滑，大于50的原因是为了让页面不会那么敏感
                                 //左滑操作 -- 
                                 if (newImgIndex > 0) {
                                     newImgIndex--;
                                     if (newImgIndex == -1) {
                                         newImgIndex += 1;
                                         // 返回最终值，避免因为index值符合条件重复进入循环
                                         return 0;
                                     }
                                     // newImgName[index].src
                                     //  console.log(newImgIndex);
                                     $('#showBigImg2').attr("src", newImgName[newImgIndex].src); //根据改变的index值，去JSON数据中取得对应的图片src
                                 }
                             } else if (X < -50) { //X小于0表示右滑，小于50的原因同左滑
                                 //右滑操作 ++
                                 if (newImgIndex < newImgName.length) {
                                     newImgIndex++;
                                     if (newImgIndex == newImgName.length) {
                                         newImgIndex -= 1;
                                         return newImgName.length; // 返回最终值，避免因为index值符合条件重复进入循环
                                     }
                                     $('#showBigImg2').attr("src", newImgName[newImgIndex].src); //根据改变的index值替换图片src
                                 }
                             }
                         });
                     }
             }
         }
     })
 });