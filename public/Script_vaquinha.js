document.addEventListener("DOMContentLoaded", () => {
  
    const btnCreditCard = document.getElementById("btnCreditCard");
    const btnPix = document.getElementById("btnPix");
    const cardFieldsContainer = document.getElementById("cardFieldsContainer");
    const form = document.querySelector("form");

    
    let selectedPaymentMethod = "pix";

  
    if (btnCreditCard && btnPix && cardFieldsContainer) {
        btnCreditCard.addEventListener("click", () => {
            selectedPaymentMethod = "credit_card";
            cardFieldsContainer.style.display = "block";
            btnCreditCard.classList.add("active");
            btnPix.classList.remove("active");
        });

        btnPix.addEventListener("click", () => {
            selectedPaymentMethod = "pix";
            cardFieldsContainer.style.display = "none";
            btnPix.classList.add("active");
            btnCreditCard.classList.remove("active");
        });
    }

    
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault(); 

            
            const formData = {
                paymentMethod: selectedPaymentMethod,
                payer: {
                    name: document.getElementById("name")?.value || "",
                    email: document.getElementById("email")?.value || "",
                    cpf: document.getElementById("payerDocument")?.value || "",
                    phone: document.getElementById("payerPhone")?.value || "",
                },
                amount: document.getElementById("amount")?.value || "0",
                isRecurring: document.getElementById("recurrence")?.checked || false,
            };

            
            if (selectedPaymentMethod === "credit_card") {
                formData.card = {
                    number: document.getElementById("cardNumber")?.value || "",
                    expiry: document.getElementById("cardExpiry")?.value || "",
                    cvc: document.getElementById("cardCvc")?.value || "",
                    holder: document.getElementById("cardHolder")?.value || "",
                };
            }

            try {
              
                const response = await fetch('http://localhost:3000', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dadosFormulario),
                });

                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status}`);
                }

                const data = await response.json();
                console.log("Sucesso:", data);
                
                
                if (selectedPaymentMethod === "pix" && data.qrCodeUrl) {
                    
                    alert("Doação iniciada via Pix! Redirecionando...");
                } else {
                    alert("Doação realizada com sucesso!");
                }

            } catch (error) {
                console.error("Erro no envio:", error);
                alert("Houve um problema ao processar a doação. Tente novamente.");
            }
        });
    }
});
