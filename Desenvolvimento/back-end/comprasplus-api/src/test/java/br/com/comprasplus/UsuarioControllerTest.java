
package br.com.comprasplus;

import br.com.comprasplus.model.Usuario;
import br.com.comprasplus.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuarioRepository.deleteAll(); // Limpa antes de cada teste

        usuario = new Usuario();
        usuario.setNome("Teste Usuário");
        usuario.setEmail("teste@exemplo.com");
        usuario.setSenha("123456");
        usuarioRepository.save(usuario);
    }

    @Test
    void deveRetornarUsuarioPorId() throws Exception {
        mockMvc.perform(get("/api/usuarios/" + usuario.getId())
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(usuario.getId().intValue())))
                .andExpect(jsonPath("$.nome", is("Teste Usuário")))
                .andExpect(jsonPath("$.email", is("teste@exemplo.com")));
    }
}
