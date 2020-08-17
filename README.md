>**HOST** http://35.247.178.19:3000/

## API cho NaniBank

### API lấy thông tin


>**GET** /partner/  

<pre>
    <b>Header</b>  
    {  
    "timestamp": 12345679121  
    "authen-hash": "3vudiH0Kyo8c7Qa4ihIIvL/yO8fN+ondP6aEhFJlZTA="
    "name": "KiantoBank"
    "origin": "domain name"
    }  

    <b>Param</b>  
    {   
        "id": 9704366600000002  
    }  
</pre>  


"authen-hash": SHA256(timestamp+secretkey+body).digest(hex)  
body sẽ là {} nếu request không có field
 "timestamp": Thời gian gửi, nếu thời gian hiện tại - thời gian gửi > 30s, request bị từ chối  
 "name": tên ngân hàng đối tác  
 "id": số tài khoản cần tra  
 "origin": dùng để check cors, browser sẽ tự add origin vào
 

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


>**POST** /partner/transfer

<pre>
    <b>Header</b>   
    {  
    "timestamp": 12345679121  
    "authen-hash": "3vudiH0Kyo8c7Qa4ihIIvL/yO8fN+ondP6aEhFJlZTA="  
    "sig": ""  
    "name": "tên bank nguồn"
    }  

    <b>Body: JSON</b>   
    {  
        "from_id": "tài khoản nguồn"
        "to_id": 9704366600000002  
        "amount": 10000
        "message": "nội dung chuyển tiền, có thể rỗng nhưng phải có field"
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
