import React, { useState } from 'react';
import { Box, Button, TextField, Typography, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import { useTheme } from '@emotion/react';
import axios from 'axios';

const FormCreateBilling = () => {
    const theme = useTheme();
    const [tipoPessoa, setTipoPessoa] = useState('');
    const [dadosFormulario, setDadosFormulario] = useState({
        name: '',
        cpf: '',
        rg: '',
        amount: '',
        dueDate: '',
        tipoPessoa: '',
    });

    const handleChangeTipoPessoa = (event) => {
        setTipoPessoa(event.target.value);
    };

    const handleGerarBoleto = () => {
        axios.post('https://peoplemanager.com.br/casadomenino/cobranca-boletos/api-boletos/cobrar.php', {
            name: dadosFormulario.name,
            cpf: dadosFormulario.cpf,
            rg: dadosFormulario.rg,
            amount: dadosFormulario.amount,
            dueDate: dadosFormulario.dueDate,
            tipoPessoa: tipoPessoa,
        })
        .then((response) => {
            console.log(response);
        }, (error) => {
            console.log(error);
        });
    }

    const handleSetDados = (event) => {
        setDadosFormulario({
            ...dadosFormulario,
            [event.target.id]: event.target.value,
        });
    }


    return (
        <Box sx={{ bgColor: theme.palette.background.default, width: {xs: '100%', sm: '100%', md: '50%'}, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Typography variant='h5'>Formulário de Geração de Boleto</Typography>
            <TextField onChange={handleSetDados} id='name' label='Nome' variant='outlined' />            
            <TextField onChange={handleSetDados} id='cpf' label='CPF' variant='outlined' />
            <TextField onChange={handleSetDados} id='rg' label='RG' variant='outlined' />
            <TextField onChange={handleSetDados} id='amount' label='Valor' variant='outlined' />
            <TextField onChange={handleSetDados} type='date' id='dueDate' label='Vencimento' variant='outlined' InputLabelProps={{ shrink: true }} />
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Tipo de Pessoa</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={tipoPessoa}
                label="Tipo de Pessoa"
                onChange={handleChangeTipoPessoa}
            >
                <MenuItem select value="PESSOA_FISICA">Pessoa Física</MenuItem>
                <MenuItem value="PESSOA_JURIDICA">Pessoa Jurídica</MenuItem>
            </Select>
            </FormControl>
            <Button variant='contained' color='primary' onClick={()=>handleGerarBoleto()}>Gerar Boleto</Button>
        </Box>
    );
    }

export default FormCreateBilling;