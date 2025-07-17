package br.com.comprasplus.controller;

import br.com.comprasplus.model.ItemLista;
import br.com.comprasplus.model.ListaCompras;
import br.com.comprasplus.repository.ItemListaRepository;
import br.com.comprasplus.repository.ListaComprasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/itens")
public class ItemListaController {

    @Autowired
    private ItemListaRepository itemListaRepository;

    @Autowired
    private ListaComprasRepository listaComprasRepository;

    @GetMapping
    public List<ItemLista> listarTodos() {
        return itemListaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemLista> buscarPorId(@PathVariable Long id) {
        Optional<ItemLista> item = itemListaRepository.findById(id);
        return item.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ItemLista> criar(@RequestBody ItemLista item) {
        if (item.getLista() == null || item.getLista().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<ListaCompras> lista = listaComprasRepository.findById(item.getLista().getId());
        if (lista.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        item.setLista(lista.get());
        return ResponseEntity.ok(itemListaRepository.save(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemLista> atualizar(@PathVariable Long id, @RequestBody ItemLista dadosAtualizados) {
        return itemListaRepository.findById(id).map(item -> {
            item.setNome(dadosAtualizados.getNome());
            item.setQuantidade(dadosAtualizados.getQuantidade());
            item.setPesoKg(dadosAtualizados.getPesoKg());
            return ResponseEntity.ok(itemListaRepository.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (itemListaRepository.existsById(id)) {
            itemListaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
