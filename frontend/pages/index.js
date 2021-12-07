import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ethers } from "ethers";
import "react-toastify/dist/ReactToastify.css";

import Head from "next/head";
import abi from "../utils/BuyMeACoffee.json";

export default function Home() {
const contractAddress = "";

const contractABI = abi.abi;

const [currentAccount, setCurrentAccount] = useState("");
const [message, setMessage] = useState("");
const [name, setName] = useState("");

const [allCoffee, setAllCoffee] = useState([]);

const checkConnectedWallet = async () => {
    try {
        const { ethereum } = window;
        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
            const account = accounts[0];
            setCurrentAccount(account);
                toast.success("☕️ Wallet berhasil Terkoneksi", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
        } else {
            toast.warn("Pastikan MetaMask kamu sudah terkoneksi", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
        }
    } catch (error) {
        toast.error(`${error.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    }
};

const connectToWallet = async () => {
    try {
        const { ethereum } = window;

        if (!ethereum) {
            toast.warn("Pastikan MetaMask kamu sudah terkoneksi", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
            return;
        }

        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });

        setCurrentAccount(accounts[0]);
    } catch (error) {
        console.log(error);
    }
};

const buyCoffee = async () => {
    try {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const buyMeACoffeeContract = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
            );

            let count = await buyMeACoffeeContract.getTotalCoffee();

            const coffeeTxn = await buyMeACoffeeContract.buyCoffee(
                message?message: "Seonggok kopi",
                name?name: "Tidak dikenali",
                ethers.utils.parseEther("0.001"),
                {
                    gasLimit: 300000,
                }
            );

            toast.info("Mengambil duit buat ngirim kopi...", {
                position: "top-left",
                autoClose: 18050,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
            await coffeeTxn.wait();

            count = await buyMeACoffeeContract.getTotalCoffee();

            setMessage("");
            setName("");

            toast.success("Kopi berhasil dikirim!", {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
        } else {
            console.log("Ethereum object doesn't exist");
        }
    } catch (error) {
        toast.error(`${error.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
};

const getAllCoffee = async () => {
    try {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const buyMeACoffeeContract = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
            );

            const coffees = await buyMeACoffeeContract.getAllCoffee();

            const coffeeCleaned = coffees.map((coffee) => {
                return {
                    address: coffee.giver,
                    timestamp: new Date(coffee.timestamp * 1000),
                    message: coffee.message,
                    name: coffee.name,
                };
            });

            setAllCoffee(coffeeCleaned);
        } else {
            console.log("Ethereum object doesn't exist");
        }
    } catch (error) {
        console.log(error);
    }
};

useEffect(() => {
    let buyMeACoffeeContract;
    getAllCoffee();
    checkConnectedWallet();

    const onKopiBaru = (from, timestamp, message, name) => {
        setAllCoffee((prevState) => [
            ...prevState,
            {
                address: from,
                timestamp: new Date(timestamp * 1000),
                message: message,
                name: name
            },
        ]);
    };

    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        buyMeACoffeeContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );
        buyMeACoffeeContract.on("KopiBaru", onKopiBaru);
    }

    return () => {
        if (buyMeACoffeeContract) {
            buyMeACoffeeContract.off("KopiBaru", onKopiBaru);
        }
    };
}, []);

const handleOnMessageChange = (event) => {
    const { value } = event.target;
    setMessage(value);
};
const handleOnNameChange = (event) => {
    const { value } = event.target;
    setName(value);
};

return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Head>
            <title>Buy Me a Coffee ☕️</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
            <h1 className="text-6xl font-bold text-yellow-800 mb-6">
                Buy Me A Coffee ☕️
            </h1>

            {
                currentAccount ? (
                    <div className="w-full max-w-xs sticky top-3 z-50 ">
                        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="name"
                            >
                                Nama
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                type="text"
                                placeholder="Isi nama..."
                                onChange={handleOnNameChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="message"
                            >
                                Isi pesan
                            </label>

                            <textarea
                                className="form-textarea mt-1 block w-full shadow appearance-none py-2 px-3 border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="3"
                                placeholder="Isi pesan..."
                                id="message"
                                onChange={handleOnMessageChange}
                                required
                            ></textarea>
                        </div>

                        <div className="flex items-left justify-between">
                            <button
                                className="bg-yellow-500 hover:bg-yellow-700 text-center text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={buyCoffee}
                            >
                            Kirim Kopi
                            </button>
                        </div>
                        </form>
                    </div>
                ) : (
                    <button
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded-full mt-3"
                        onClick={connectToWallet}
                    >
                        Buka Wallet Anda
                    </button>
                )
            }

            {
                allCoffee.map((coffee, index) => {
                    return (
                        <div className="border-l-2 mt-10" key={index}>
                            <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-yellow-800 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0">
                                <div className="w-5 h-5 bg-yellow-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>
                                <div className="w-10 h-1 bg-green-300 absolute -left-10 z-0"></div>
                                <div className="flex-auto">
                                    <h1 className="text-md">Supporter: {coffee.name}</h1>
                                    <h1 className="text-md">Message: {coffee.message}</h1>
                                    <h3>Address: {coffee.address}</h3>
                                    <h1 className="text-md font-bold">
                                        Timestamp: {coffee.timestamp.toString()}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </main>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    </div>
);
}
