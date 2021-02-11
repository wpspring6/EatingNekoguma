import React, { useState, Fragment, constructor } from 'react';
import { Form, Button, FormText } from 'react-bootstrap';
import axios from 'axios';
import "./index.css";


const Shop = () => {
    const useInput = (initialValue: string) => {
      const [value, set] = useState(initialValue)
      return { value, onChange: (e: { target: { value: any; }; }) => set(e.target.value) }
    };

    const [shopName, setShopName] = useState<string>("");
    const [shopPcode, setShopPcode] = useState<string>("");
    const [shopAddress1, setShopAddress1] = useState<string>("");
    const [shopAddress2, setShopAddress2] = useState<string>("");
    const [shopDetail, setShopDetail] = useState<string>("");
    const [shopImage, setShopImage] = useState<string>("");
    const [file, setFileImage] = useState<any | undefined>(undefined);
    const [loginId, setLoginId] = useState<any>("");
    
    const images = `http://MacBook-Pro.local:5500/golang/images/${shopImage}`;
  
  const sendFile = () => {
    // show loading modal
    let formData = new FormData();
    formData.append("shop_img", file[0]);
    axios
      .post(
        'http://127.0.0.1:1323/shops/img',
        formData,
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        }
      )
      .then(() => {
        console.log('upload failed...');
      },
      )
      .catch(() => {
        console.log('upload failed...');
      });
    }

    const constructor = () => {
        if(shopName == "" && shopDetail == ""){
            axios
            .get(
                'http://localhost:1323/shop/info',
                {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                withCredentials: true
                }
            )
            .then(results => {
            setShopName(results.data.Shop_name);
            setShopDetail(results.data.Shop_detail);
            setShopImage(results.data.Shop_img);
            setShopPcode(results.data.Shop_pode);
            setShopAddress1(results.data.Shop_address1);
            setShopAddress2(results.data.Shop_address2);
            console.log(results.data);
            }
            )
            .catch(
                error => {
                console.log(error);
                }
            );
        }
      };
    
    const handleSubmit = () => {
      axios
      .get(
          'http://localhost:1323/cookie/get',
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true
          }
      )
      .then(results => {
        console.log(results.data);
      }
      )
      .catch(
          error => {
            console.log(error);
          }
      );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      var form = new FormData();
    
      fetch('http://localhost:1323/shops/img', {
        method: "POST",
        body: form
      }).then(
        response => response.json()
      ).then(
        data => {
      });
    }

    function insertData() {
      let params = new URLSearchParams();
      axios
      .get(
          'http://localhost:1323/cookie/get',
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true
          }
      )
      .then(results => {
        console.log(results.data);
        setLoginId(results.data);
      }
      )
      .catch(
          error => {
            console.log(error);
          }
      );
      params.append('Shop_id', loginId)
      params.append('Shop_name', shopName);
      params.append('Shop_detail', shopDetail);
      if(file){
        params.append('Shop_img', file[0].name);
      }
      params.append('SHop_pode', shopPcode);
      params.append('Shop_address1',shopAddress1);
      params.append('Shop_address2', shopAddress2);
      
      axios
        .post(
          'http://localhost:1323/shops/update',
          params,
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true
          })
        .then(results => {
          console.log(results);
        });
        if(file){
          sendFile();
        }
    }
  
    return (
      <div className="shop-form">
        {constructor()}
        <div style={{height:"10px"}} />
        <h1>店舗情報登録</h1>
        <form>
          <dl>
            <div className="formItem">
              <dt>店舗名</dt>
              <dd>
                <input
                  type="text"
                  value={shopName}
                  onChange = {(event: React.ChangeEvent<HTMLInputElement>)=> {
                    setShopName(event.target.value);
                  }}
                />
              </dd>
            </div>
            <div className="formItems">
              <dt>
                住所
              </dt>
              <dd>
                <dl>
                  <dt className="form-detail">
                    郵便番号
                  </dt>
                  <dd>
                    <input id="post-code" type="text" value={shopPcode} onChange={ (event: React.ChangeEvent<HTMLInputElement>) => { setShopPcode(event.target.value) }} />
                  </dd>
                  <dt className="form-detail">
                    都道府県・市区町村・番地
                  </dt>
                  <dd>
                    <input type="text" value={shopAddress1} onChange={ (event: React.ChangeEvent<HTMLInputElement>) => { setShopAddress1(event.target.value) }} />
                  </dd>
                  <dt className="form-detail">
                    建物名など
                  </dt>
                  <dd>
                    <input type="text" value={shopAddress2} onChange={ (event: React.ChangeEvent<HTMLInputElement>) => { setShopAddress2(event.target.value) }} />
                  </dd>
                </dl>
              </dd>
            </div>
            <div className="formItems">
              <dt>
                店舗側コメント
              </dt>
              <dd>
                <textarea　value={shopDetail} onChange={ (event: React.ChangeEvent<HTMLTextAreaElement>) => { setShopDetail(event.target.value) }}/>
              </dd>
            </div>
            <div className="formItems">
              <dt>
                店舗画像
              </dt>
              <dd>
                <input type="file" onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setFileImage(event.target.files) }} />
                <div className="formItems">
                  <dl>
                    <dt className="form-detail">
                      現在登録済みの画像
                    </dt>
                    <dd>
                      <img src={images} width="256" height="128" alt="店舗画像" />
                    </dd>
                  </dl>
                </div>
              </dd>
            </div>
          </dl>
            <div className="button_wrapper">
              <Button
              style={{
                margin:'auto'
                }}
              onClick={async () => {
                try {
                  insertData();
                } catch (error) {
                  // ユーザー作成が失敗するとその内容をアラート表示
                  alert(error.message);
                }
              }} >
                登録
              </Button>
            </div>
          </form>
        </div>
    );
}

export default Shop;