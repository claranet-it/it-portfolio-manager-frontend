import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { getIcon } from 'src/components/icons';
import { useCurriculumVitae } from 'src/hooks/curriculum/useCurriculumVitae';
import { t } from 'src/locale/labels';

export const CurriculumVitae = component$(() => {
	const { curriculumVitae, initCurriculumVitae } = useCurriculumVitae();
	useVisibleTask$(async () => {
		await initCurriculumVitae();
	});

	return (
		<div class='flex h-screen flex-col'>
			<header>
				<div class='items-center justify-between border-b border-b-darkgray-300 bg-white md:flex lg:flex'>
					<div class='px-6 py-4 sm:text-center [&_svg]:sm:inline'>
						{getIcon('Claranet')}
					</div>
				</div>
			</header>
			<div class='w-2/3 space-y-6 px-6 pb-16 pt-2.5'>
				{JSON.stringify(curriculumVitae.value) === '{}' ? (
					<div>{t('NO_DATA')}</div>
				) : (
					<>
						<div>
							<h1 class='me-4 text-3xl font-bold text-darkgray-900'>
								{curriculumVitae.value.name}
							</h1>
							<p class='text-xl text-gray-600'>
								<em>{curriculumVitae.value.role}</em>
							</p>
						</div>
						<div class='space-y-4 text-gray-600'>
							<p class='text-justify'>{curriculumVitae.value.summary}</p>
						</div>
						<div class='space-y-4 text-gray-600'>
							<h2 class='me-4 text-2xl font-bold text-darkgray-900'>Main skills</h2>

							{curriculumVitae.value.main_skills}
						</div>

						<div class='space-y-4 text-gray-600'>
							<h2 class='me-4 text-2xl font-bold text-darkgray-900'>Education</h2>
							{curriculumVitae.value.education?.map(
								({ year_start, year_end, note, institution, current }) => {
									return (
										<div>
											<div>
												{year_start} - {current ? t('PRESENT') : year_end}
											</div>

											<strong>{institution}</strong>
											<div>{note}</div>
										</div>
									);
								}
							)}
						</div>

						<div class='space-y-4 text-gray-600'>
							<h2 class='me-4 text-2xl font-bold text-darkgray-900'>
								Work experience
							</h2>
							{curriculumVitae.value.work?.map(
								({ year_start, year_end, role, note, institution, current }) => {
									return (
										<div>
											<div>
												{year_start} - {current ? t('PRESENT') : year_end}
											</div>

											<strong>
												{role} &#64;{institution}
											</strong>
											<div>{note}</div>
										</div>
									);
								}
							)}
						</div>
					</>
				)}
			</div>

			<footer class='fixed bottom-0 space-y-6 border-t border-t-darkgray-300 bg-white px-6 pb-2 pt-2 text-[8px] print:fixed print:bottom-0 print:left-0'>
				<span class='font-bold text-red-600'> Claranet S.r.l. </span> Società con socio
				unico Claranet Group Limited Capitale Sociale €10.000 interamente versato. Corso
				Europa, 13 – 20122 Milano - P.IVA e C.F. 09725520960 Registro Imprese Milano REA
				2110026 - PEC: claranetsrl@legalmail.it
			</footer>
		</div>
	);
});
