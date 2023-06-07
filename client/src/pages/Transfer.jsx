import React, { useEffect, useState } from "react";
import FormField from "../components/FormField";
import { CustomButton } from "../components";
import { useStateContext } from "../context";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
const Transfer = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState("transfer");
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        tokenAddress: "",
        recipientAddress: "",
        amount: "",
      });
    const {transferERC20}  = useStateContext();
    const handleFormFieldChange = (fieldName, e) => {
        setForm({ ...form, [fieldName]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            var trasferSucced = await transferERC20(form.recipientAddress,form.tokenAddress,form.amount)
            console.log(trasferSucced)
        }catch(error){
            setIsLoading(false)
        }

        setIsLoading(false);
        navigate("/");
    }

    return(
        <div>
            {isLoading && <Loader />}
            <h1 className="font-epilogue font-semibold text-[30px] text-white text-center"> {"Send tokens here"} </h1>
            <div className="bg-[#1c1c24] flex mt-4 justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
            <form
                    onSubmit={handleSubmit}
                    className="w-full mt-[65px] flex flex-col gap-[30px]"
                >
                    <div className="flex flex-wrap gap-[40px]">
                   
                    <FormField
                        labelName="TokenAddress *"
                        placeholder="Token you want to send.."
                        inputType="text"
                        value={form.tokenAddress}
                        handleChange={(e) => handleFormFieldChange("tokenAddress", e)}
                    />
                    </div>

                    <FormField
                    labelName="Recipient Address *"
                    placeholder="The address you want to send"
                    value={form.description}
                    handleChange={(e) => handleFormFieldChange("recipientAddress", e)}
                    />

                    <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        labelName="Amount *"
                        placeholder="USDC 1000"
                        inputType="text"
                        value={form.amount}
                        handleChange={(e) => handleFormFieldChange("amount", e)}
                    />
                    </div>
                    <div className="flex justify-center items-center mt-[40px]">
                    <CustomButton
                        btnType="submit"
                        title="Send"
                        styles="bg-[#1dc071]"
                    />
                    </div>
                </form>
            </div>
        </div>
  
    );
};

export default Transfer;
