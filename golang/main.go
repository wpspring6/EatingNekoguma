package main

import (
	"fmt"
	_ "fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/ipfans/echo-session"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

type owner struct {
	OwnerID       int    `json:Owner_id`
	OwnerName     string `json:Owner_name`
	OwnerEmail    string `json:Owner_email`
	OwnerPassword string `json:owner_passowrd`
}

type shop struct {
	ShopID         int       `json:id`
	ShopName       string    `json:shop_name`
	ShopComment    string    `json:shop_comment`
	ShopImage      string    `json:shop_img`
	ShopPcode      string    `json:shop_pode`
	ShopAddress1   string    `json:shop_address1`
	ShopAddress2   string    `json:shop_address2`
	ShopCreatedate time.Time `json:created`
	ShopUpdatadate time.Time `json:updated`
}

func gormConnect() *gorm.DB {
	db, err := gorm.Open("mysql", "root:root@tcp(nekoguma_mysql:3306)/nekoguma_database")
	if err != nil {
		panic(err.Error())
	}
	return db
}

func main() {
	e := echo.New()
	e.Use(middleware.CORS())
	var allowedOrigins = []string{
		"http://localhost:3000",
	}
	e.Use(
		middleware.CORSWithConfig(middleware.CORSConfig{
			AllowCredentials: true,
			AllowOrigins:     allowedOrigins,
			AllowHeaders: []string{
				echo.HeaderAccessControlAllowHeaders,
				echo.HeaderContentType,
				echo.HeaderContentLength,
				echo.HeaderAcceptEncoding,
				echo.HeaderXCSRFToken,
				echo.HeaderAuthorization,
			},
			AllowMethods: []string{
				http.MethodGet,
				http.MethodPut,
				http.MethodPatch,
				http.MethodPost,
				http.MethodDelete,
			},
			MaxAge: 86400,
		}),
	)

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	//セッションを設定
	store := session.NewCookieStore([]byte("secret"))
	//セッション保持時間
	store.MaxAge(86400)
	e.Use(session.Sessions("GSESSION", store))
	e.GET("/", func(ctx echo.Context) error {
		session := session.Default(ctx)
		var count int
		v := session.Get("count")
		if v == nil {
			count = 0
		} else {
			count = v.(int)
			count += 1
		}
		session.Set("count", count)
		session.Save()
		ctx.JSON(200, map[string]interface{}{
			"visit": count,
		})
		return nil
	})
	e.POST("/shops/insert", insertData)
	e.GET("/shops", getShopData)
	e.POST("/shops/img", UploadImg)
	e.POST("/owners/insert", insertUserData)
	e.POST("/owners/select", selectUserData)
	e.GET("/cookie/delete", deleteCookie)
	e.GET("/cookie/get", readCookie)
	e.GET("/shop/info", getShopInfo)
	e.POST("/shops/update", updateShopData)
	e.Logger.Fatal(e.Start(":1323"))
}

func updateShopData(c echo.Context) (err error) {
	db := gormConnect()
	defer db.Close()
	reqShopInfo := &shop{}
	if err := c.Bind(reqShopInfo); err != nil {
		return err
	}
	login_id := reqShopInfo.ShopID
	print(login_id)
	shop := new(shop)
	db.Where("ShopID = ?", login_id).First(&shop)
	shop.ShopName = reqShopInfo.ShopName
	shop.ShopComment = reqShopInfo.ShopComment
	shop.ShopImage = reqShopInfo.ShopImage
	shop.ShopAddress1 = reqShopInfo.ShopAddress1
	shop.ShopAddress2 = reqShopInfo.ShopAddress2
	shop.ShopPcode = reqShopInfo.ShopPcode
	shop.ShopUpdatadate = time.Now()
	db.Table("shops").Where("ShopID = ?", login_id).Update(&shop)
	return c.JSON(http.StatusOK, &shop)
}

func getShopInfo(c echo.Context) (err error) {
	db := gormConnect()
	defer db.Close()
	// セッションからidを取得
	session := session.Default(c)
	login_id := session.Get("id")
	// idをもとに店舗情報をDBから取得
	shop := &shop{}
	db.Where("owners.OwnerID = ?", login_id).Joins("INNER JOIN owners on owners.OwnerID = shops.ShopID").First(&shop)
	return c.JSON(http.StatusOK, shop)
}

func selectUserData(c echo.Context) (err error) {
	request := new(owner)
	if err := c.Bind(request); err != nil {
		return err
	}
	owner := &owner{}
	db := gormConnect()
	defer db.Close()
	db.Where("OwnerEmail = ? AND OwnerPassword = ?", request.OwnerEmail, request.OwnerPassword).First(&owner)
	if owner.OwnerID != 0 {
		session := session.Default(c)
		print(owner.OwnerID)
		session.Set("id", owner.OwnerID)
		session.Save()
	}
	return c.JSON(http.StatusOK, owner.OwnerID)
}

func insertData(c echo.Context) (err error) {
	request := new(shop)
	if err := c.Bind(request); err != nil {
		return err
	}
	db := gormConnect()
	defer db.Close()
	shop := &shop{}
	shop.ShopName = request.ShopName
	shop.ShopComment = request.ShopComment
	shop.ShopImage = request.ShopImage
	shop.ShopPcode = request.ShopPcode
	shop.ShopAddress1 = request.ShopAddress1
	shop.ShopAddress2 = request.ShopAddress2
	shop.ShopCreatedate = time.Now()
	shop.ShopUpdatadate = time.Now()
	db.Table("shops").Create(&shop)
	return c.JSON(http.StatusOK, shop)
}

func insertUserData(c echo.Context) (err error) {
	request := new(owner)
	if err := c.Bind(request); err != nil {
		return err
	}
	db := gormConnect()
	defer db.Close()
	user := &owner{}
	user.OwnerName = request.OwnerName
	user.OwnerEmail = request.OwnerEmail
	user.OwnerPassword = request.OwnerPassword
	db.Table("owners").Create(&user)
	cookie := new(http.Cookie)
	cookie.Name = "username"
	cookie.Value = request.OwnerName
	cookie.Expires = time.Now().Add(24 * time.Hour)
	cookie.Path = "/"
	cookie.SameSite = http.SameSiteNoneMode
	cookie.Secure = false
	cookie.HttpOnly = false
	c.SetCookie(cookie)
	return c.JSON(http.StatusOK, user)
}

func getShopData(c echo.Context) (err error) {
	db := gormConnect()
	defer db.Close()
	shopData := []shop{}
	if err := c.Bind(shopData); err != nil {
		return err
	}
	// 構造体のデータ作
	db.Table("shops").Find(&shopData)
	fmt.Print(shopData)
	return c.JSON(http.StatusCreated, shopData)
}

func UploadImg(c echo.Context) error {
	upload_file, err := c.FormFile("ShopImage")
	if err != nil {
		return err
	}

	src, err := upload_file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	dst_file, err := os.Create("images/" + upload_file.Filename)
	fmt.Print(upload_file.Filename)
	if err != nil {
		return err
	}
	defer dst_file.Close()

	if _, err = io.Copy(dst_file, src); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, upload_file.Filename)
}

func deleteCookie(c echo.Context) error {
	session := session.Default(c)
	session.Delete("id")
	session.Save()
	return c.String(http.StatusOK, "delete a cookie")
}

func readCookie(c echo.Context) error {
	session := session.Default(c)
	login_id := session.Get("id")
	return c.JSON(http.StatusOK, login_id)
}
