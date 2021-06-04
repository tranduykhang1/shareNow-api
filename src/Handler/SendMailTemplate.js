const style = {
    container:
          `font-family: Arial, Helvetica, sans-serif;
          margin: 20px auto;
          padding: 20px;
          background-color: #2E86C1;
          box-shadow: 1px 4px 5px #B8B8B8;
          border-radius: 3px;
          color: white;
          width: 400px;
          text-align: center`
    ,
    title:
          `font-size: 30px;
          color: #FFBF07;
          margin-bottom: 10px;`
        
    ,
    desc:
        `margin: 0;
        font-size: 20px;`
        
    ,
    btnConfirm:
          `border: none;
          margin: 20px;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          background: #f9c711;`
        
    ,
    confirmLink:
          `text-decoration: none;
          font-weight: 600;
          font-size: 18px;
          color: #333333;    `
}



module.exports.confirmEmailTemplate = (token) => {
    return `
        <div style="${style.container}">
          <h4 style="${style.title}">Xin chào!</h4>
          <p style="${style.desc}">Chào mừng bạn đã đến với ShareNow. Hãy click "Xác nhận" để hoàn thành đăng kí!</p>
          <button style="${style.btnConfirm}">
                  <a href= "http://localhost:1234/auth/confirm-email/?token=${token}" style="${style.confirmLink}">Xác nhận</a>
                </button>
        </div>
        `;
};
