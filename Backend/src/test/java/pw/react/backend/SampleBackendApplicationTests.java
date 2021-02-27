package pw.react.backend;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles(profiles = {"mysql-dev"})
class SampleBackendApplicationTests {

//	@Autowired
//	private HttpClient httpService;
//
//	@Test
//	void contextLoads() {
//	}
//
//	@Test
//	void whenConsume_thenReturnQuote() {
//		final Quote quote = httpService.consume("");
//		assertThat(quote).isNotNull();
//	}
}
