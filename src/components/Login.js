import React, { useState, useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { Icon } from '@iconify/react';
import { ethers } from 'ethers';
// import shareVideo from '../assets/share.mp4';
// import shareVideo from '../assets/hangout.mp4';
import sharePic from '../assets/hangoutp.jpg';
// import logo from '../assets/logowhite.png';
import { client } from '../client';



const Login = () => {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [accountBalance, setAccountBalance] = useState('');
const [accountAddress, setAccountAddress] = useState('');
const { ethereum } = window;
const provider = new ethers.providers.Web3Provider(window.ethereum);

  const navigate = useNavigate();
  const responseGoogle = (response) => {
    localStorage.setItem('user', JSON.stringify(response.profileObj));
    // console.log(response);
    const { name, googleId, imageUrl } = response.profileObj;
    
    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl,
    };
       client.createIfNotExists(doc)
       .then(() => {
         navigate('/', { replace: true })
       })
 
  };

  useEffect(() => {
    const { ethereum } = window;
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      sethaveMetamask(true);
    };
    checkMetamaskAvailability();
  }, []);


  const connectWallet = async () => {
    try{
    
      if (!ethereum) {
        sethaveMetamask(false);
      }
    
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      let balance = await provider.getBalance(accounts[0]);
      let bal = ethers.utils.formatEther(balance);
      setAccountAddress(accounts[0]);
      setAccountBalance(bal);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
    };
    
 
  


  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className=" relative w-full h-full cover ">
        <img
          src={sharePic}
          alt="img"
          
          className="w-full h-full "
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
          <div className="p-5">
            <img src="" alt="img" width="130px" />
          </div>

          <div className="shadow-2xl">
            <GoogleLogin
              clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-4" /> Sign in with google
                </button>
                
              )}
                
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
            <br></br>
              <div>
            <button
            type="button"
            className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
            onClick={connectWallet}
           
          >
          <Icon icon="logos:metamask-icon" className="mr-4"/> Sign in with metamask  
          </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
