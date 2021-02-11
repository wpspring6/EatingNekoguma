import React, { useState, Fragment, constructor, FC } from 'react';
import axios from 'axios';
import { default as Slider, Settings, CustomArrowProps } from "react-slick";
import "./site.css";
import { Reveal } from "react-genie";
import * as L from "layout-styled-components";
import { Animation } from "react-genie-styled-components";
import caffeImage from "../public/site_header.jpg";
import caffeImage2 from "../public/caffe_image.jpg";
import caffeImage3 from "../public/caffe_image2.jpg";
import caffeImage4 from "../public/caffe_image3.jpg";
import "react-placeholder/lib/reactPlaceholder.css";
import { ReactGenieAnimations } from "react-genie-styled-components";


const SiteTop = () => {
return(
    <div>
        <header>
                コーヒー図鑑
        </header>
        <body>
            <img src={caffeImage} alt="店舗画像" />
            <h2>
                「このカフェ好きだな。」「このカフェ仕事しやすいな。」<br/>
                そんな気持ちを保存しませんか？
            </h2>
            <p>
                いろいろなカフェに行って、気に入ったカフェはありませんか？
            </p>
            <p>
                素敵なカフェを忘れないようにスマホに保存できたら・・・。
            </p>
            <p>
                そんな願いを叶えるアプリを作りました。
            </p>
            <ReactGenieAnimations />
            <L.Vertical center spaceAll={100}>
                <Reveal animation={Animation.SlideInLeft}>
                    <h2>ご利用例</h2>
                    <img src={caffeImage} alt="店舗画像" />
                </Reveal>
                <Reveal animation={Animation.SlideInRight}>
                    <div className="wrap">
                        <div className="item">
                            <img className="item-image" src={caffeImage2} alt="利用者イメージ" />
                            <p>お気に入りの店舗を推す</p>
                            <div className="btn">
                                <a href="#">GotoApp</a>
                            </div>
                        </div>
                        <div className="item">
                            <img className="item-image" src={caffeImage3} alt="利用者イメージ" />
                            <p>カフェ経営者の方</p>
                            <div className="btn">
                                <a href="">Page</a>
                            </div>
                        </div>
                        <div className="item">
                            <img className="item-image" src={caffeImage4} alt="利用者イメージ" />
                            <p>ご利用になる方</p>
                            <div className="btn">
                                <a href="">Next</a>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </L.Vertical>
        </body>
    </div>
);
}

export default SiteTop;