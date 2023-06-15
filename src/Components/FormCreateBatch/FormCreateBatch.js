import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useDropzone } from "react-dropzone";
import { read, utils } from "xlsx";
import moment from "moment";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from "@mui/icons-material/Download";

const FormCreateBatch = () => {
  const theme = useTheme();
  const [cobrar, setCobrar] = useState([]);
  // States para o modal de edição ------------
  const [open, setOpen] = useState(false);
  const [dadosEditados, setDadosEditados] = useState({
    nome: "",
    cpf_cnpj: "",
    rg: "",
    valor: "",
    vencimento: "",
    tipo_pessoa: "",
  });
  const handleClickOpen = (
    nome,
    cpf_cnpj,
    rg,
    valor,
    vencimento,
    tipo_pessoa
  ) => {
    setOpen(true);
    const cpfCnpjSemFormatacao = cpf_cnpj.replace(/[.-/\s]/g, "");
    setDadosEditados({
      nome: nome,
      cpf_cnpj: cpfCnpjSemFormatacao,
      rg: rg,
      valor: valor,
      vencimento: vencimento,
      tipo_pessoa: tipo_pessoa,
    });
  };
  

  const handleClose = () => {
    setOpen(false);
    setDadosEditados({
      nome: "",
      cpf_cnpj: "",
      rg: "",
      valor: "",
      vencimento: "",
      tipo_pessoa: "",
    });
  };

  // ------------------------------------------

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_URL}/listar_lote.php`)
      .then((response) => setCobrar(response.data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result;
        const workbook = read(binaryStr, { type: "binary" });

        // Itera sobre cada worksheet e converte em JSON
        workbook.SheetNames.forEach((sheetName) => {
          const sheetToJson = utils.sheet_to_json(workbook.Sheets[sheetName]);
          // Faça algo com os dados (ex.: envie ao backend)
          axios
            .post(`${process.env.REACT_APP_URL}/carga_lote.php`, sheetToJson)
            .then((response) => {
              console.log(response.data);
              if (response.data && response.data.status === "ok") {
                window.location.reload(); // Recarrega a página
              }
            })
            .catch((error) => console.error("Error:", error));
        });
      };
      reader.readAsBinaryString(file);
    });
  }, []);

  const handleGerarCobrancas = () => {
    axios
      .post(`${process.env.REACT_APP_URL}/cobrar_lote.php`)
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleDeleteBilling = (id) => {
    axios
      .post(`${process.env.REACT_APP_URL}/deletar_cobranca.php`, { id: id })
      .then((response) => {
        console.log(response.data);
        if (response.data && response.data === "success") {
          window.location.reload();
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleSendEditValues = () => {
    axios
      .post(`${process.env.REACT_APP_URL}/editar_cobranca.php`, dadosEditados)
      .then((response) => {
        console.log(response.data);
        if (response.data && response.data === "success") {
          window.location.reload();
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

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
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: theme.palette.text.primary, textAlign: "center" }}
        >
          Cadastro de Lote
        </Typography>
        <div
          style={{
            border: "3px dashed lightgrey",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "20px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <Typography sx={{ display: "flex", alignItems: "center" }}>
            Arraste e solte algum arquivo aqui, ou clique para selecionar
            arquivos <FileUploadIcon />
          </Typography>
        </div>
        {acceptedFiles.map((file) => (
          <Typography
            key={file.path}
            sx={{ color: theme.palette.text.primary }}
          >
            {file.path}
          </Typography>
        ))}
        {/* Link para baixar o arquivo modelo */}
        <Typography
          sx={{
            color: theme.palette.text.primary,
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
          component="a"
          href={`${process.env.REACT_APP_URL}/lote_boletos.xlsx`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Baixe o arquivo modelo <DownloadIcon />
        </Typography>
      </Box>
      <TableContainer sx={{ marginTop: 3 }} component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>CPF/CNPJ</TableCell>
              <TableCell>RG</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Vencimento</TableCell>
              <TableCell>Tipo de pessoa</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cobrar.map((row) => {
              const valorFormatado = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(row.valor);
              const vencimentoFormatado = moment(row.vencimento).format(
                "DD/MM/YYYY"
              );
              return (
                <TableRow
                  key={row.nome}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.nome}
                  </TableCell>
                  <TableCell>{row.cpf_cnpj}</TableCell>
                  <TableCell>{row.rg}</TableCell>
                  <TableCell>{valorFormatado}</TableCell>
                  <TableCell>{vencimentoFormatado}</TableCell>
                  <TableCell>{row.tipo_pessoa}</TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton
                        aria-label="editar"
                        sx={{ color: theme.palette.primary.dark }}
                        onClick={() =>
                          handleClickOpen(
                            row.nome,
                            row.cpf_cnpj,
                            row.rg,
                            row.valor,
                            row.vencimento,
                            row.tipo_pessoa
                          )
                        }
                      >
                        <ModeEditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Apagar">
                      <IconButton
                        aria-label="apagar"
                        color="error"
                        onClick={() =>
                          handleDeleteBilling(row.id)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        disabled={cobrar.length > 0 ? false : true}
        sx={{ marginTop: 3 }}
        variant="contained"
        onClick={() => handleGerarCobrancas()}
      >
        Gerar Cobranças
      </Button>

      {/* -------------------- MODAL -------------------- */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle color="primary">Editar Cobrança</DialogTitle>
        <DialogContent>
          <DialogContentText>Editar dados da cobrança</DialogContentText>
          <TextField
            type="text"
            margin="dense"
            id="nome"
            label="Nome"
            fullWidth
            value={dadosEditados.nome}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, nome: e.target.value })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="cpf_cnpj"
            label="CPF/CNPJ"
            fullWidth
            value={dadosEditados.cpf_cnpj}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, cpf_cnpj: e.target.value })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="rg"
            label="RG"
            fullWidth
            value={dadosEditados.rg}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, rg: e.target.value })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="valor"
            label="Valor"
            fullWidth
            value={dadosEditados.valor}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, valor: e.target.value })
            }
          />
          <TextField
            type="date"
            margin="dense"
            id="vencimento"
            label="Vencimento"
            fullWidth
            value={dadosEditados.vencimento}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, vencimento: e.target.value })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="tipo_pessoa"
            label="Tipo de pessoa"
            fullWidth
            value={dadosEditados.tipo_pessoa}
            onChange={(e) =>
              setDadosEditados({
                ...dadosEditados,
                tipo_pessoa: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
          <Button onClick={() => handleSendEditValues()}>Alterar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FormCreateBatch;
