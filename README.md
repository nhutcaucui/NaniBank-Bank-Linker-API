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
        "id": 97043666000010  
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
        "to_id": 97043666000010  
        "amount": 10000
        "message": "nội dung chuyển tiền, có thể rỗng nhưng phải có field"
    }  
</pre>

 "sig": signature sign với secret key encode base64
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
 
 >**Thuật toán sign PGP**

<pre>
   const openpgp = require('openpgp');
   async function detachedSign(secret) {
    const { keys: [privateKey] } = await openpgp.key.readArmored(prkey);
    await privateKey.decrypt(passphrase);
  
    const { signature: detachedSignature } = await openpgp.sign({
      message: openpgp.cleartext.fromText(secret), // CleartextMessage or Message object
      privateKeys: [privateKey],                            // for signing
      detached: true
    });
  
    return detachedSignature;
  }
</pre>

secret: "himom" <br/>
passphrase: passphrase khi tạo key<br/>
prkey: privatekey dùng để sign<br/>

>**Example request**

<pre>
var timestamp = moment().unix();
      var secretKey= 'himom';
      const body = {
    from_id: 123456789,
    to_id: 97043666000010,
    amount: 1000000,
    message: 'this is a fake test',
      }
  var detachedSignature = await pgp.detachedSign('himom');
    var config={headers: {
        //origin: "www.nguyen.com",
        name: "nanibank",
        timestamp: timestamp,
        "authen-hash": Crypto.createHash('sha256').update(timestamp + secretKey + JSON.stringify(body)).digest('hex'),
        sig: new Buffer.from(detachedSignature).toString('base64'),
      }
    }
      
    axios.post('http://35.247.178.19:3000/partner/transfer',body, config).then(function (res) {
        console.log(res.data);
    }).catch(function (error) {
        console.log(error);
    });
</pre>

