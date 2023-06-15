import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  FormGroup,
  Zoom
} from "@mui/material";
import { useTheme } from "@emotion/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {formatToCPFOrCNPJ, isCPFOrCNPJ, formatToPhone, isPhone, parseToNumber } from 'brazilian-values'

const FormCreateBilling = () => {
  const theme = useTheme();
  const [tipoPessoa, setTipoPessoa] = useState("PESSOA_FISICA");
  const [linhaDigitavel, setLinhaDigitavel] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [dadosFormulario, setDadosFormulario] = useState({
    name: "",
    cpf: "",
    rg: "",
    periodo: "",
    amount: "",
    dueDate: "",
    tipoPessoa: "",
    vencimento_parcelas: "",
  });
  const [formattedCpf, setFormattedCpf] = useState("");
  const [correioMarcado, setCorreioMarcado] = useState(false);
  const [pagamentoRecorrenteMarcado, setPagamentoRecorrenteMarcado] = useState(false);

  const handleSetDados = (event) => {
    setDadosFormulario({
      ...dadosFormulario,
      [event.target.name]: event.target.value,
    });
    console.log(event.target.id+" : "+event.target.value);
  };

  const handleChangeTipoPessoa = (event) => {
    setTipoPessoa(event.target.value);
  };

  const handleGerarBoleto = () => {
    console.log("Form...:",dadosFormulario);
    if (dadosFormulario.name !== "") {
      const amountFormatted = parseToNumber(dadosFormulario.amount);
      axios
        .post(`${process.env.REACT_APP_URL}/cobrar.php?type=1`, {
          name: dadosFormulario.name,
          cpf: (dadosFormulario.cpf).replace(/[./]/g, "").replace(/[-]/g, "").trim(),
          rg: dadosFormulario.rg,
          amount: amountFormatted,
          dueDate: dadosFormulario.dueDate,
          tipoPessoa: tipoPessoa,
        })
        .then(
          (response) => {
            console.log(response.data);
            if (response.data.linhaDigitavel) {
              setLinhaDigitavel(response.data.linhaDigitavel);
              setOpenModal(true);
            } else {
              alert("Erro ao gerar boleto: " + response.data.message);
            }
          },
          (error) => {
            console.log(error);
          }
        );
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(linhaDigitavel);
    window.location.reload();
  };

  const handlePrintBoleto = () => {
    window.open(
      `${process.env.REACT_APP_URL}/impressao.php?linhaDigitavel=${linhaDigitavel}`,
      "_blank"
    );
    window.location.reload();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    window.location.reload();
  };

  const handleCpfChange = (event) => {
    setDadosFormulario({
      ...dadosFormulario,
      [event.target.name]: event.target.value,
    });
    const { value } = event.target;
    const formattedValue = formatToCPFOrCNPJ(value);
    setFormattedCpf(formattedValue);
    

  };

  console.log(isCPFOrCNPJ(dadosFormulario.cpf))

  const handleCorreioChange = (event) => {
    setCorreioMarcado(event.target.checked);    
  };

  const handlePagamentoRecorrenteChange = (event) => {
    setPagamentoRecorrenteMarcado(event.target.checked);
  };

  return (
    <>
      <Box
        sx={{
          bgColor: theme.palette.background.default,
          width: { xs: "100%", sm: "100%", md: "50%" },
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          margin: "0 auto",
          paddingTop: 3,
        }}
      >
        <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
          Gerar Boleto
        </Typography>
        <TextField
          onChange={handleSetDados}
          name="name"
          label="Nome"
          variant="outlined"
        />
        <TextField
          // onChange={handleSetDados}
          name="cpf"
          label="CPF"
          variant="outlined"
          value={formattedCpf}
          required
          onChange={handleCpfChange}
        />
        <TextField
          onChange={handleSetDados}
          name="rg"
          label="RG"
          variant="outlined"
        />
        <TextField
          onChange={handleSetDados}
          name="amount"
          label="Valor"
          variant="outlined"
        />
        <TextField
          onChange={handleSetDados}
          type="date"
          name="dueDate"
          label="Vencimento"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        {/* <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend">Tipo de Pessoa</FormLabel>
          <RadioGroup
            aria-label="Tipo de Pessoa"
            name="tipoPessoa"
            value={tipoPessoa}
            onChange={handleChangeTipoPessoa}
            sx={{ display: "flex", flexDirection: "row" }}
          >
            <FormControlLabel
              value="PESSOA_FISICA"
              control={<Radio />}
              label="Pessoa Física"
            />
            <FormControlLabel
              value="PESSOA_JURIDICA"
              control={<Radio />}
              label="Pessoa Jurídica"
            />
          </RadioGroup>
        </FormControl> */}
        <FormGroup row>
          {/* <FormControlLabel control={<Switch checked={correioMarcado} onChange={handleCorreioChange} />} label="Correio" /> */}
          <FormControlLabel control={<Switch checked={pagamentoRecorrenteMarcado} onChange={handlePagamentoRecorrenteChange} />} label="Pagamento Recorrente" />
        </FormGroup>
        {/* {correioMarcado && (
          <Zoom in={correioMarcado} timeout={500} unmountOnExit>       
            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '15px'}}>
              <Typography sx={{width: '100%'}} variant="h6">Endereço</Typography>
              <TextField sx={{width: {xs: '100%', sm: '48%'}}} onChange={handleSetDados} name="cep" label="CEP" />
              <TextField sx={{width: {xs: '100%', sm: '48%'}}} onChange={handleSetDados} name="logradouro" label="Logradouro" />
              <TextField sx={{width: {xs: '100%', sm: '48%'}}} onChange={handleSetDados} name="numero" label="Número" />
              <TextField sx={{width: {xs: '100%', sm: '48%'}}} onChange={handleSetDados} name="complemento" label="Complemento" />
              <TextField sx={{width: {xs: '100%', sm: '48%'}}} onChange={handleSetDados} name="bairro" label="Bairro" />
              <TextField sx={{width: {xs: '100%', sm: '48%'}}} onChange={handleSetDados} name="cidade" label="Cidade" />
              <TextField sx={{width: {xs: '100%', sm: '48%'}}} onChange={handleSetDados} name="estado" label="Estado" />          
            </Box>
        </Zoom>
        )} */}
        {pagamentoRecorrenteMarcado && (
          <Zoom in={pagamentoRecorrenteMarcado} timeout={500} unmountOnExit>
            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '15px'}}>
              <Typography sx={{width: '100%'}} variant="h6">Pagamento Recorrente</Typography>
              <TextField sx={{width: {xs: '100%', sm: '48%'}}} onChange={handleSetDados} name="periodo" label="Periodo" />
              <FormControl sx={{width: {xs: '100%', sm: '48%'}}}>
                <InputLabel id="vencimento_parcela-label">Vencimento das parcelas</InputLabel>
                <Select
                  labelId="vencimento_parcela-label"
                  label="Vencimento das parcelas"
                  id="vencimento_parcelas"
                  name="vencimento_parcelas"                  
                  onChange={handleSetDados}
                >
                  <MenuItem value='5'>Dia 5</MenuItem>
                  <MenuItem value='10'>Dia 10</MenuItem>
                  <MenuItem value='15'>Dia 15</MenuItem>
                </Select>
              </FormControl>

              </Box>
          </Zoom>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleGerarBoleto()}
        >
          Gerar Boleto
        </Button>
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Linha Digitável</DialogTitle>
        <DialogContent>
          <Typography>{linhaDigitavel}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyToClipboard}>Copiar</Button>
          <Button onClick={handlePrintBoleto}>Imprimir Boleto</Button>
          <Button onClick={handleCloseModal}>Fechar</Button>
        </DialogActions>
      </Dialog>
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
        theme="dark"
      />
    </>
  );
};


export default FormCreateBilling;
