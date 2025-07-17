package br.com.comprasplus.controller;

import br.com.comprasplus.model.ListaCompras;
import br.com.comprasplus.model.Usuario;
import br.com.comprasplus.repository.ListaComprasRepository;
import br.com.comprasplus.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/listas")
public class ListaComprasController {

    @Autowired
    private ListaComprasRepository listaComprasRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // GET /api/listas
    @GetMapping
    public List<ListaCompras> listarTodas() {
        return listaComprasRepository.findAll();
    }

    // GET /api/listas/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ListaCompras> buscarPorId(@PathVariable Long id) {
        Optional<ListaCompras> lista = listaComprasRepository.findById(id);
        return lista.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // ✅ GET /api/listas/usuario/{usuarioId}
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ListaDTO>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<ListaCompras> listas = listaComprasRepository.findByUsuarioId(usuarioId);
        List<ListaDTO> resposta = listas.stream().map(ListaDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(resposta);
    }

    // POST /api/listas
    @PostMapping
    public ResponseEntity<ListaCompras> criar(@RequestBody ListaCompras lista) {
        lista.setDataCriacao(LocalDate.now());

        if (lista.getUsuario() == null || lista.getUsuario().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Usuario> usuario = usuarioRepository.findById(lista.getUsuario().getId());
        if (usuario.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        lista.setUsuario(usuario.get());
        return ResponseEntity.ok(listaComprasRepository.save(lista));
    }

    // PUT /api/listas/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ListaCompras> atualizar(@PathVariable Long id, @RequestBody ListaCompras dados) {
        return listaComprasRepository.findById(id).map(lista -> {
            lista.setTitulo(dados.getTitulo());
            lista.setDescricao(dados.getDescricao());
            lista.setFinalizada(dados.isFinalizada());
            return ResponseEntity.ok(listaComprasRepository.save(lista));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/listas/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (listaComprasRepository.existsById(id)) {
            listaComprasRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ DTO interno (usado apenas para resposta simplificada)
    public static class ListaDTO {
        public Long id;
        public String nome;
        public String descricao;
        public boolean selecionado;

        public ListaDTO(ListaCompras lista) {
            this.id = lista.getId();
            this.nome = lista.getTitulo();
            this.descricao = lista.getDescricao();
            this.selecionado = lista.isFinalizada(); 
        }
    }
}
