import React, { useState, createContext } from "react";
import { CustomButton } from "../../components";
import Loader from "../../components/Loader";
import FormField from "../../components/FormField";
import { useStateContext } from "../../context";
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { ethers } from "ethers";
const ICO = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [txSucces, setTxSucces] = useState(null);
    const { contract,address, checkUserAllowance, setAllowance, getDecimals, getGasLimit} = useStateContext();
    const [form, setForm] = useState({
        title: "",
        description: "",
        target: "",
        stardDate: "",
        endDate: "",
        equityToken:"",
        equityAmount:"",
      });
    
    const handleFormFieldChange = (fieldName, e) => {
        setForm({ ...form, [fieldName]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Step1: check user allowance");
        
        var ok = await checkUserAllowance(form.equityToken,address,form.equityAmount);
        console.log(ok);
        if(!ok){
            console.log("allowance too low");
            console.log("Step 1.1: set user allowance to amount value:", form.equityAmount);
            var allowance = await setAllowance(form.equityToken,address,form.equityAmount);
            console.log(allowance);
        }
        setIsLoading(true);
        
        var decimals = await getDecimals(form.equityToken)
        console.log(Math.floor((new Date(form.stardDate)).getTime() / 1000))
        console.log(Math.floor((new Date(form.endDate)).getTime() / 1000))
        try {
            const data = await contract.methods.createProject(
            form.title,
            form.description,
            ethers.utils.parseUnits(form.target, 18),
            form.equityToken,
            ethers.utils.parseUnits(form.equityAmount,decimals),
            Math.floor((new Date(form.stardDate)).getTime() / 1000),
            Math.floor((new Date(form.endDate)).getTime() / 1000),
        ).send({from: address});
        console.log("contract call success:", data);
        setTxSucces(data)
        }catch(error){
            console.log(error)
            setIsLoading(false);
            setErrorMessage('An error occurred while sending the transaction.');
            return;
        }
        console.log("Step2");
        
        setIsLoading(false);
        navigate("/");
    };

    return(
        <div>
            <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
            {isLoading && <Loader />}
                <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                    <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
                        Create your fundraising
                    </h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="w-full mt-[65px] flex flex-col gap-[30px]"
                >
                    <div className="flex flex-wrap gap-[40px]">
                   
                    <FormField
                        labelName="Title *"
                        placeholder="Write a title"
                        inputType="text"
                        value={form.title}
                        handleChange={(e) => handleFormFieldChange("title", e)}
                    />
                    </div>

                    <FormField
                    labelName="Story *"
                    placeholder="Write your story"
                    isTextArea
                    value={form.description}
                    handleChange={(e) => handleFormFieldChange("description", e)}
                    />

                    <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[70px] rounded-[10px]">
                    <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
                        You will get 100% of the raised amount
                    </h4>
                    </div>

                    <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        labelName="Goal *"
                        placeholder="USDC 1000"
                        inputType="text"
                        value={form.target}
                        handleChange={(e) => handleFormFieldChange("target", e)}
                    />
                    </div>
                    <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        labelName="Start date *"
                        placeholder="Start date"
                        inputType="datetime-local"
                        value={form.stardDate}
                        handleChange={(e) => handleFormFieldChange("stardDate", e)}
                    />
                    <FormField
                        labelName="End date *"
                        placeholder="End date"
                        inputType="datetime-local"
                        value={form.endDate}
                        handleChange={(e) => handleFormFieldChange("endDate", e)}
                    />
                    </div>
                    <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        labelName="Rewards Amount *"
                        placeholder="USDC 1000"
                        inputType="text"
                        value={form.equityAmount}
                       handleChange={(e) => handleFormFieldChange("equityAmount", e)}
                    />
                    <FormField
                        labelName="Rewards Token *"
                        placeholder="USDC"
                        inputType="text"
                        value={form.equityToken}
                       handleChange={(e) => handleFormFieldChange("equityToken", e)}
                    />
                    </div>
                    <div className="flex justify-center items-center mt-[40px]">
                    <CustomButton
                        btnType="submit"
                        title="Submit"
                        styles="bg-[#1dc071]"
                    />
                    </div>
                </form>
                <div style={{ position: "fixed", bottom: 20, right: 20 }}>
                    {errorMessage && (
                       <Alert variant="filled" severity="error" onClose={() => {setErrorMessage("")}}>{errorMessage}</Alert>
                    )}
                </div>
                <div style={{ position: "fixed", bottom: 20, right: 20 }}>
                    {txSucces && (
                       <Alert  variant="filled" severity="success" onClose={() => {setTxSucces("")}}>{txSucces}</Alert>
                    )}
                </div>
        </div>
    </div>
    );
};

export default ICO;
