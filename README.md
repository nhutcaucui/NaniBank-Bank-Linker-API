>**HOST** 35.240.195.17

## API cho NaniBank

### API lấy thông tin


>**POST** /users/customer/get  

<pre>
    <b>Header</b>  
    {  
    "timestamp": 12345679121  
    "authen-hash": "3vudiH0Kyo8c7Qa4ihIIvL/yO8fN+ondP6aEhFJlZTA="  
    }  

    <b>Body: JSON</b>  
    {  
        "name": "KiantoBank"  
        "id": 9704366600000002  
    }  
</pre>  


"authen-hash": SHA256(timestamp+secretkey+body).digest(Base64)  
 "timestamp": Thời gian gửi, nếu thời gian hiện tại - thời gian gửi > 30s, request bị từ chối  
 "name": tên ngân hàng đối tác  
 "id": số tài khoản cần tra  

>**Return**  
 <pre>
 <b>Success</b>
    {  
        "status": true,  
        "message": "Here's a customer",  
        "id": 123445678,  
        "name": "Nobody"  
    }  
 <b>Failed</b>
    {  
        "status": false,  
        "message": "Error message",    
    }  
 </pre>

### API nộp tiền


>**POST** /transaction/add  

<pre>
    <b>Header</b>   
    {  
    "timestamp": 12345679121  
    "authen-hash": "3vudiH0Kyo8c7Qa4ihIIvL/yO8fN+ondP6aEhFJlZTA="  
    "sig": ""  
    }  

    <b>Body: JSON</b>   
    {  
        "name": "bank"  
        "id": 9704366600000002  
        "amount": 10000  
    }  
</pre>

 "sig": signature sign với secret key  
 "amount": số tiền cần nộp  

>**Return**  
 <pre>
 <b>Success</b>
    {  
        "status": true,  
        "message": "Transfer money successfully",  
        "balance": 5000000,  
        "signature": "signature go here"  
    }  
 <b>Failed</b>
    {  
        "status": false,  
        "message": "Error message",    
    }  
 </pre>
