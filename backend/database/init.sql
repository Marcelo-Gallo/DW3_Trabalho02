CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS itempedido;
DROP TABLE IF EXISTS pedidocompra;
DROP TABLE IF EXISTS produto;
DROP TABLE IF EXISTS fornecedor;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE IF NOT EXISTS usuarios (
    usuarioid bigserial CONSTRAINT pk_usuarios PRIMARY KEY,
    username varchar(20) UNIQUE,
    password text, -- Hash do bcrypt
    isadmin boolean DEFAULT false,
    deleted boolean DEFAULT false
);




CREATE TABLE IF NOT EXISTS fornecedor (
    fornecedorid bigserial CONSTRAINT pk_fornecedor PRIMARY KEY,
    nomefantasia varchar(100),
    razaosocial varchar(100),
    cnpj varchar(20) UNIQUE,
    removido boolean DEFAULT false
);




CREATE TABLE IF NOT EXISTS produto (
    produtoid bigserial CONSTRAINT pk_produto PRIMARY KEY,
    nome varchar(100),
    descricao text,
    codigobarras varchar(50) UNIQUE,
    valorProduto numeric(10,2) DEFAULT 0.00,
    fornecedorid bigint CONSTRAINT fk_produto_fornecedor REFERENCES fornecedor(fornecedorid),
    removido boolean DEFAULT false
);



CREATE TABLE IF NOT EXISTS pedidocompra (
    pedidocompraid bigserial CONSTRAINT pk_pedidocompra PRIMARY KEY,
    numero varchar(50) UNIQUE,
    datapedido date, 
    valortotal numeric(10,2), 
    removido boolean DEFAULT false
);



CREATE TABLE IF NOT EXISTS itempedido (
    itempedidoid bigserial CONSTRAINT pk_itempedido PRIMARY KEY,
    pedidocompraid bigint CONSTRAINT fk_item_pedido REFERENCES pedidocompra(pedidocompraid),
    produtoid bigint CONSTRAINT fk_item_produto REFERENCES produto(produtoid),
    quantidade numeric(10,2),
    valorunitario numeric(10,2),
    removido boolean DEFAULT false
);



INSERT INTO usuarios (username, password, isadmin, deleted) 
VALUES ('admin', crypt('123', gen_salt('bf')), true, false)
ON CONFLICT DO NOTHING;

INSERT INTO fornecedor (nomefantasia, razaosocial, cnpj, removido)
VALUES ('Fornecedor Padrão', 'Empresa Teste LTDA', '00.000.000/0001-00', false);

INSERT INTO produto (nome, descricao, codigobarras, valorProduto, fornecedorid, removido)
VALUES ('Produto Teste', 'Descrição do produto teste', '1234567890', 50.00, 1, false);

INSERT INTO pedidocompra (numero, datapedido, valortotal, removido)
VALUES ('PED-DEMO-001', CURRENT_DATE, 500.00, false);

INSERT INTO itempedido (pedidocompraid, produtoid, quantidade, valorunitario, removido)
VALUES (1, 1, 10, 50.00, false);