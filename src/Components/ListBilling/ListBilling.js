import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Tooltip,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PrintIcon from "@mui/icons-material/Print";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import moment from "moment";

const ListBilling = () => {
  const theme = useTheme();
  const [listBilling, setListBilling] = useState([]);
  const [expiryDate, setExpiryDate] = useState(null);
  const [nossoNumero, setNossoNumero] = useState(null);

  // States para o modal de edição ------------
  const [open, setOpen] = useState(false);
  const handleClickOpen = (vencimento, nossoNumero) => {
    setExpiryDate(vencimento);
    setNossoNumero(nossoNumero);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setExpiryDate(null);
    setNossoNumero(null);
  };
  // ------------------------------------------

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_URL}/cobrar.php?type=3`
      )
      .then(
        (response) => {
          setListBilling(response.data);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  const handleDeleteBilling = (nossoNumero) => {
    axios
      .post(
        `${process.env.REACT_APP_URL}/cobrar.php?type=4`,
        {
          nossoNumero: nossoNumero,
        }
      )
      .then(
        (response) => {
          if (response.data.trim() === "success") {
            toast.success("Boleto cancelado com sucesso!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              onClose: () => {
                window.location.reload();
              },
            });
          } else {
            toast.error(response.data.trim(), {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }
        },
        (error) => {
          toast.error("Erro ao remover a cobrança", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      );
  };

  const handleCopyToClipboard = (linhaDigitavel) => {
    navigator.clipboard.writeText(linhaDigitavel);
    toast.success("Linha digitável copiada com sucesso!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const handlePrintBoleto = (linhaDigitavel) => {
    window.open(
      `${process.env.REACT_APP_URL}/impressao.php?linhaDigitavel=${linhaDigitavel}`,
      "_blank"
    );
    window.location.reload();
  };

  const handleEditDueDate = () => {
    axios
      .post(
        `${process.env.REACT_APP_URL}/cobrar.php?type=5`,
        {
          nossoNumero: nossoNumero,
          vencimento: expiryDate,
        }
      )
      .then(
        (response) => {
          console.log(response.data);
          if (response.data.trim() === "success") {
            toast.success("Vencimento alterado com sucesso!", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            window.location.reload();
          } else {
            toast.error("Erro ao atualizar o vencimento", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }
        },
        (error) => {
          toast.error("Erro ao atualizar o vencimento", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      );
  };
  return (
    <Box sx={{ paddingTop: 3 }}>
      <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
        Lista de cobranças
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Nome</TableCell>
              <TableCell align="center">CPF/CNPJ</TableCell>
              <TableCell align="center">Valor</TableCell>
              <TableCell align="center">Vencimento</TableCell>
              <TableCell align="center">Linha Digitável</TableCell>
              <TableCell align="center">Nosso Número</TableCell>
              <TableCell align="center">Criação</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Ambiente</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listBilling?.map((item, index) => {
              const valorFormatado = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(item.valor);
              const vencimentoFormatado = moment(item.vencimento).format(
                "DD/MM/YYYY"
              );
              const dateCreatedFormatado = moment(item.dateCreated).format(
                "DD/MM/YYYY HH:mm:ss"
              );

              return item.status !== "BAIXADO" ? (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.nome}
                  </TableCell>
                  <TableCell>{item.cpf_cnpj}</TableCell>
                  <TableCell>{valorFormatado}</TableCell>
                  <TableCell>{vencimentoFormatado}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Tooltip title="Copiar para área de transferência">
                      <ContentCopyIcon
                        sx={{
                          cursor: "pointer",
                          color: theme.palette.primary.main,
                        }}
                        onClick={() =>
                          handleCopyToClipboard(item.linhaDigitavel)
                        }
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell>{item.nossoNumero}</TableCell>
                  <TableCell>{dateCreatedFormatado}</TableCell>
                  <TableCell>
                    {item.status == "" ? "Pendente" : item.status}
                  </TableCell>
                  <TableCell>
                    {item.ambiente == "HOMOLOGACAO"
                      ? "Homologação"
                      : "Produção"}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Imprimir boleto">
                      <IconButton
                        aria-label="imprimir"
                        color="primary"
                        onClick={() => handlePrintBoleto(item.linhaDigitavel)}
                      >
                        <PrintIcon />
                      </IconButton>
                    </Tooltip>
                    {/* <Tooltip title="Editar">
                                    <IconButton aria-label="editar" sx={{color: theme.palette.primary.dark}} onClick={() => handleClickOpen(item.vencimento, item.nossoNumero)}>
                                        <ModeEditIcon />
                                    </IconButton>
                                    </Tooltip> */}
                    <Tooltip title="Cancelar cobrança">
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleDeleteBilling(item.nossoNumero)}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ) : null;
            })}
          </TableBody>
        </Table>
      </TableContainer>
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle color="primary">Editar Data de Vencimento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Editar data de vencimento do boleto {nossoNumero}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Data de vencimento"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            sx={{ marginTop: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
          <Button onClick={() => handleEditDueDate()}>Alterar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListBilling;
