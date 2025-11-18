CREATE TABLE IF NOT EXISTS usuarios (
    usuarioid bigserial CONSTRAINT pk_usuarios PRIMARY KEY,
    username varchar(20) UNIQUE,
    password text, -- Armazena o hash do bcryptjs
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
    codigobarras varchar(50),
    removido boolean DEFAULT false
);


-- Relacionamento 1:N
-- um fornecedor pode ter vários pedidos
CREATE TABLE IF NOT EXISTS pedidocompra (
    pedidocompraid bigserial CONSTRAINT pk_pedidocompra PRIMARY KEY,
    numero varchar(50),
    datapedido date, 
    valortotal numeric(10,2), 
    fornecedorid bigint CONSTRAINT fk_pedido_fornecedor REFERENCES fornecedor(fornecedorid),
    removido boolean DEFAULT false
);


-- Relacionamento N:N
-- um pedido pode ter varios itens
-- um item pode pertencer a varios pedidos
CREATE TABLE IF NOT EXISTS itempedido (
    itempedidoid bigserial CONSTRAINT pk_itempedido PRIMARY KEY,
    pedidocompraid bigint CONSTRAINT fk_item_pedido REFERENCES pedidocompra(pedidocompraid),
    produtoid bigint CONSTRAINT fk_item_produto REFERENCES produto(produtoid),
    quantidade numeric(10,2),
    valorunitario numeric(10,2),
    removido boolean DEFAULT false
);

INSERT INTO fornecedor (nomefantasia, razaosocial, cnpj, removido)
VALUES ('Fornecedor Padrão', 'Empresa Teste LTDA', '00.000.000/0001-00', false);

INSERT INTO produto (nome, descricao, codigobarras, removido)
VALUES ('Produto Teste', 'Descrição do produto teste', '1234567890', false);