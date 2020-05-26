### API for NaniBank

#### API lấy thông tin


>**POST** /users/customer/ping  

    
    Header 
    {  
    "timestamp": 12345679121  
    "authen-hash": "3vudiH0Kyo8c7Qa4ihIIvL/yO8fN+ondP6aEhFJlZTA="  
    }  

    Body  
    {  
        "name": "bank"  
        "id": 564521456  
    }  
    


"authen-hash": SHA256(timestamp+secretkey+body).digest(Base64)  
 "timestamp": Thời gian gửi, nếu thời gian hiện tại - thời gian gửi > 30s, request bị từ chối  
 "name": tên ngân hàng đối tác  
 "id": số tài khoản cần tra  

#### API nộp tiền


>**POST** /transaction/add  

    
    **`Header`**   
    {  
    "timestamp": 12345679121  
    "authen-hash": "3vudiH0Kyo8c7Qa4ihIIvL/yO8fN+ondP6aEhFJlZTA="  
    "sig": ""  
    }  

    Body   
    {  
        "name": "bank"  
        "id": 564521456  
        "amount": 500  
    }  
    

 "sig": signature sign với secret key  
 "amount": số tiền cần nộp  