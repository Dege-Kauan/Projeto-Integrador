package br.com.comprasplus.controller;

import br.com.comprasplus.model.Usuario;
import br.com.comprasplus.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Usuario criar(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario dadosAtualizados) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setNome(dadosAtualizados.getNome());
            usuario.setEmail(dadosAtualizados.getEmail());
            usuario.setTelefone(dadosAtualizados.getTelefone());
            usuario.setEndereco(dadosAtualizados.getEndereco());
            usuario.setDataNascimento(dadosAtualizados.getDataNascimento());

            // Só atualiza a senha se ela foi enviada
            if (dadosAtualizados.getSenha() != null && !dadosAtualizados.getSenha().isBlank()) {
                usuario.setSenha(dadosAtualizados.getSenha());
            }

            return ResponseEntity.ok(usuarioRepository.save(usuario));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario dados) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(dados.getEmail());

        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            if (usuario.getSenha().equals(dados.getSenha())) {
                return ResponseEntity.ok(usuario);
            }
        }

        return ResponseEntity.status(401).build(); // Não autorizado
    }
}
