import axios from "axios" // 引入 axios
import { useState } from "react" // 引入 useState

const BASE_URL = import.meta.env.VITE_BASE_URL; //取得.env檔案裡面的環境變數
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [tempProduct, setTempProduct] = useState({});
  const [products, setProducts] = useState([]); // 宣告 products 狀態
  const [isAuth, setIsAuth] = useState(false) // 宣告 isAuth 狀態, 預設值為 false,代表尚未登入
  const [account, setAccount] = useState(
    {
      username: 'example@test.com',
      password: 'example'
    }
  ) //  宣告 account 狀態
  
  const handleInputChange = (e) => {
    // console.log(e.target.name);
    // console.log(e.target.value);
    const { value, name } = e.target; //解構賦值
    // console.log(name)
    setAccount({
      ...account, //account 展開
      [name]: value
    })
    // console.log(account);
  }
  const handleLogin = (e) => {
    e.preventDefault(); //移除預設事件, 現在按下enter 等同於sumbit

    // console.log(import.meta.env.VITE_BASE_URL); //取得.env檔案裡面的環境變數
    // console.log(import.meta.env.VITE_API_PATH);
    axios.post(`${BASE_URL}/v2/admin/signin`, account)
      .then((res) => {
        // console.log(res);
        setIsAuth(true); //登入成功 
        const { token, expired } = res.data;
        // console.log(res.data);
        // console.log(token);
        // console.log("expired",expired);
        document.cookie = `hexToken=xxxxxx; expires=${new Date(expired)}`;  //設定cookie, hexToken 是自己取的, 要叫什麼都可以;
        axios.defaults.headers.common['Authorization'] = token; //設定全域的header, 這樣每次發送請求都會帶上token
        
      const fetchProducts = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`);
          setProducts(res.data.products);
        }
        catch (err) {
          console.log(err);
        };
      }
      fetchProducts();
    }
    )
      .catch((err) => {
        console.log(err);
        alert('登入失敗');
      })
  }
  const checkUserLogin = async () => {
    try { 
      await axios.post(`${BASE_URL}/v2/api/user/check`)
      alert('使用者已登入');
    }
    catch (err) {
      console.log(err);
    }
  }


  return (
    <>
      {isAuth ? (<div className="container py-5">
        <div className="row">
          <div className="col-6">
            <button type="button" onClick={ checkUserLogin } className="btn btn-success mb-5">檢查使用者是否登入</button>
            <h2>產品列表</h2>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">查看細節</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>{product.is_enabled === 1 ? "是" : "否"}</td>
                    <td>
                      <button
                        onClick={() => setTempProduct(product)}
                        className="btn btn-primary"
                        type="button"
                      >
                        查看細節
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-6">
            <h2>單一產品細節</h2>
            {tempProduct.title ? (
              <div className="card">
                <img
                  src={tempProduct.imageUrl}
                  className="card-img-top img-fluid"
                  alt={tempProduct.title}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {tempProduct.title}
                    <span className="badge text-bg-primary">
                      {tempProduct.category}
                    </span>
                  </h5>
                  <p className="card-text">商品描述：{tempProduct.description}</p>
                  <p className="card-text">商品內容：{tempProduct.content}</p>
                  <p className="card-text">
                    <del>{tempProduct.origin_price} 元</del> / {tempProduct.price}{" "}
                    元
                  </p>
                  <h5 className="card-title">更多圖片：</h5>
                  {tempProduct.imagesUrl?.map((image) => (image && (<img key={image} src={image} className="img-fluid" />)))}
                </div>
              </div>
            ) : (
              <p>請選擇一個商品查看</p>
            )}
          </div>
        </div>
      </div>
      ) : <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">請先登入</h1>
        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
           {/* //form標籤裡面會有個button做送出的動作, 通常會是form 標籤搭配submit, 按下button做出sumbit的事件 */}
          <div className="form-floating mb-3">
            <input name="username" value={account.username} onChange={handleInputChange} type="email" className="form-control" id="username" placeholder="name@example.com" />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input name="password" value={account.password} onChange={handleInputChange} type="password" className="form-control" id="password" placeholder="Password" />
            <label htmlFor="password">Password</label>
          </div>
          <button type="submit" className="btn btn-primary">登入</button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>}

    </>
  )
}

export default App
