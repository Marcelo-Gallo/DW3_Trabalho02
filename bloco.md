### module.exports
```
module.exports = {
    query: (text, params) => pool.query(text, params)
}
```

- Ao inves de exportar o pool, exporta-se um objeto com uma função chamada query.
- O pool é a chave mestra, o query é o que qualquer arquivo model precisa, evitando erros.
- Basicamente os models não sabem que existe o pool, eles sabem da existencia de um db com a função .query() que eles podem usar -> evita um "pool.end()" sem querer.